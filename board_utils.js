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