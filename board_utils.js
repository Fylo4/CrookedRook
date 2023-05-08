function on_board(x, y) {
    if (y === undefined) {
        //Only square id given
        y = Math.floor(x / game_data.width);
        x %= game_data.width;
    }
    return x >= 0 && y >= 0 && x < game_data.width && y < game_data.height && game_data.active_squares.get(y * game_data.width + x);
}

function handle_make_move(src_x, src_y, dst_x, dst_y, prom) {
    if(in_multiplayer_game) {
        multiplayer_make_move(src_x, src_y, dst_x, dst_y, prom);
    }
    else {
        make_move(src_x, src_y, dst_x, dst_y, prom);
    }
}
function handle_make_drop(piece, color, dest, prom) {
    if(in_multiplayer_game) {
        multiplayer_make_drop(piece, color, dest, prom);
    }
    else {
        make_drop_move(piece, color, dest, prom);
    }
}

//piece can be an id or an object
//Makes copy_attrib work
function get_attributes(piece) {
    let ret = 
        typeof(piece) === "number" ? [...game_data.all_pieces[piece].attributes]:
        typeof(piece) === "object" ? [...piece.attributes] : [];
    if (ret.includes(attrib.copy_attrib) && board != undefined && board.copycat_memory >= 0) {
        ret.push(...game_data.all_pieces[board.copycat_memory].attributes);
    }
    return ret;
}

//All these get_x_ss are for copy_attrib
function get_solid_ss() {
    let ret = new squareset(board.solid_ss);
    if (!game_data.has_copy_attrib || board.copycat_memory < 0 || !get_attributes(board.copycat_memory).includes(attrib.ghost)) {
        return ret;
    }
    for (let a = 0; a < game_data.all_pieces.length; a ++) {
        if (get_attributes(a).includes(attrib.copy_attrib)) {
            ret.ande(board.piece_ss[a].inverse());
        }
    }
    return ret;
}

function get_attribute_ss(attribute, ss) {
    let ret = new squareset(ss);
    if (!game_data.has_copy_attrib || board.copycat_memory < 0 || !get_attributes(board.copycat_memory).includes(attribute)) {
        return ret;
    }
    for (let a = 0; a < game_data.all_pieces.length; a ++) {
        if (get_attributes(a).includes(attrib.copy_attrib)) {
            ret.ore(board.piece_ss[a]);
        }
    }
    return ret;
}

function get_iron_ss() {
    return get_attribute_ss(attrib.iron, board.iron_ss);
}

function get_tall_ss() {
    return get_attribute_ss(attrib.tall, board.tall_ss);
}
 
function get_royal_ss() {
    return get_attribute_ss(attrib.royal, board.royal_ss);
}
 
function get_passive_burn_ss() {
    return get_attribute_ss(attrib.passive_burn, board.passive_burn_ss);
}
 
function get_burn_immune_ss() {
    return get_attribute_ss(attrib.burn_immune, board.burn_immune_ss);
}
 
function get_constant_spawn_ss() {
    return get_attribute_ss(attrib.spawn_constant, board.constant_spawn_ss);
}

let file = (num) => {
    if (num < 26) {
        return String.fromCharCode(97 + num);
    }
    else if (num < 26*2) {
        return String.fromCharCode(39 + num);
    }
    return "big"
};
let rank = (num) => { return game_data.height - num; }

function find_promotions(this_id, src_sq, end_sq, is_white, is_black, brd) {
    if(brd === undefined) {
        brd = board;
    }
    let promote_to = [];
    let in_any_zone = false;
    for (let a = 0; a < game_data.all_pieces[this_id].promotions.length; a++) {
        let prom = game_data.all_pieces[this_id].promotions[a];
        let start_in_white = game_data.zones[prom.white].get(src_sq);
        let start_in_black = game_data.zones[prom.black].get(src_sq);
        let end_in_white = game_data.zones[prom.white].get(end_sq);
        let end_in_black = game_data.zones[prom.black].get(end_sq);
        if (prom.on.includes(events.self) && src_sq === end_sq &&
            ((is_white && start_in_white) || (is_black && start_in_black))) {
                promote_to.push(...prom.to);
                in_any_zone = true;
            }
        else if (prom.on.includes(events.enter) &&
            ((is_white && !start_in_white && end_in_white) ||
            (is_black && !start_in_black && end_in_black))) {
            promote_to.push(...prom.to);
            in_any_zone = true;
        }
        else if (prom.on.includes(events.exit) &&
            ((is_white && start_in_white && !end_in_white) ||
            (is_black && start_in_black && !end_in_black))) {
            promote_to.push(...prom.to);
            in_any_zone = true;
        }
        else if (prom.on.includes(events.between) &&
            ((is_white && start_in_white && end_in_white) ||
            (is_black && start_in_black && end_in_black))) {
            promote_to.push(...prom.to);
            in_any_zone = true;
        }
    }
    //If I promote to a piece in my opponent's hand, add that here
    if (in_any_zone && get_attributes(this_id).includes(attrib.promote_from_opp_hand) && game_data.has_hand) {
        let opp_hand = (!is_white && is_black) ? brd.hands.white :
            (is_white && !is_black) ? brd.hands.black :
            brd.turn ? brd.hands.white : brd.hands.black;
        for (let a = 0; a < opp_hand.length; a ++) {
            if (opp_hand[a] > 0) {
                promote_to.push(a);
            }
        }
    }
    //Go through each element of promote_to to make sure it doesn't exceed the piece limit

    promote_to = [...new Set(promote_to)]
        .filter(e => is_valid_prom(this_id, e, is_white, is_black, end_sq));

    return promote_to;
}

function is_valid_prom(this_piece, prom_piece, is_white, is_black, sq) {
    if (prom_piece === this_piece) {
        return true;
    }
    let treat_as_col = is_white + is_black*2 - 1;
    if (!slots_left(prom_piece, treat_as_col)) {
        return false;
    }
    let file_limit = game_data.all_pieces[prom_piece].file_limit;
    if (file_limit) {
        let file_col = is_white && is_black ? undefined : is_black;
        if (count_pieces_in_column(prom_piece, sq%game_data.width, file_col) >= file_limit) {
            return false;
        }
    }
    return true;
}

//Currently not used
//If I implement drop promotions, this will be useful
function find_drop_promotions(this_id, end_sq, color) {
    let promote_to = [];
    for (let a = 0; a < game_data.all_pieces[this_id].promotions.length; a++) {
        let prom = game_data.all_pieces[this_id].promotions[a];
        let end_in_white = game_data.zones[prom.white].get(end_sq);
        let end_in_black = game_data.zones[prom.black].get(end_sq);
        if (prom.on.includes(events.drop) &&
            ((!color && end_in_white) || (color && end_in_black))) {
            promote_to.push(...prom.to);
        }
    }
    //Promote from opp hand doesn't make sense here
    promote_to.filter(e => is_valid_prom(this_id, e, !color, color, end_sq));
    return ret;
}

//color is optional - if not provided, counts all pieces
function count_pieces_in_column(piece_id, column, color) {
    let ret = 0;
    for (let a = 0; a < game_data.height; a ++) {
        let sq = game_data.width*a + column;
        if (board.piece_ss[piece_id].get(sq) &&
            ((color === undefined) || (color && board.black_ss.get(sq)) || (!color && board.white_ss.get(sq)))) {
            ret ++;
        }
    }
    return ret;
}