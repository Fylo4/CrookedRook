function refresh_moves() {
	//Clear all bitboards
	for(let a = 0; a < game_data.width*game_data.height; a ++){
		board.can_move_ss[a].zero();
    }
    if (board.victory != -1) {
        return; //Nothing can move if you already won
    }
	//Find the move board for each piece
    for (let a = 0; a < game_data.all_pieces.length; a ++){
        for (let b = new squareset(board.piece_ss[a]); !b.is_zero(); b.pop()){
            let sq = b.get_ls1b();
            let step_num = 0;
            let step = game_data.all_pieces[a].move[step_num];
            let treat_as_col = board.black_ss.get(sq) && (board.turn || !board.white_ss.get(sq));
            for (let c = 0; c < step.length; c++) {
                let add = parse_term(step[c], 0, sq, a, treat_as_col);
                if (step[c][0].type === "sub") {
                    board.can_move_ss[sq].ande(add.inverse());
                }
                else {
                    board.can_move_ss[sq].ore(add);
                }
            }
            //Cannot land on occupied sanctuaries
            board.can_move_ss[sq].ande(ss_and(game_data.sanctuary, ss_or(board.white_ss, board.black_ss)).inverse());
            //Cannot land on enemy if on pacifist
            if (game_data.pacifist.get(sq)) {
                board.can_move_ss[sq].ande(treat_as_col ? board.white_ss.inverse() : board.black_ss.inverse());
            }
            //Cannot land on iron enemies
            board.can_move_ss[sq].ande(ss_and(board.iron_ss, treat_as_col ? board.white_ss : board.black_ss).inverse());
            //Berzerk
            if (game_data.all_pieces[a].attributes.includes(attrib.berzerk)) {
                let treat_as_col = board.black_ss.get(sq) && (!board.white_ss.get(sq) || board.turn);
                let enemies = treat_as_col ? board.white_ss : board.black_ss;
                if (!ss_and(board.can_move_ss[sq], enemies).is_zero()) {
                    board.can_move_ss[sq].ande(enemies);
                }
            }
            //Retreat
            if (game_data.all_pieces[a].attributes.includes(attrib.retreat)) {
                board.can_move_ss[sq].set_on(sq);
            }
		}
    }
    find_attackers();
    //Attributes that require attack squares to be calculated
    for (let a = 0; a < game_data.all_pieces.length; a ++){
        //Child
        if (game_data.all_pieces[a].attributes.includes(attrib.child)) {
            let all_pieces = new squareset(board.piece_ss[a]);
            for (; !all_pieces.is_zero(); all_pieces.pop()) {
                let sq = all_pieces.get_ls1b();
                let treat_as_col = (board.turn && board.black_ss.get(sq)) || !board.white_ss.get(sq);
                board.can_move_ss[sq].ande(treat_as_col ? board.black_attack_ss : board.white_attack_ss);
            }
        }
        //Coward
        if (game_data.all_pieces[a].attributes.includes(attrib.coward)) {
            let all_pieces = new squareset(board.piece_ss[a]);
            for (; !all_pieces.is_zero(); all_pieces.pop()) {
                let sq = all_pieces.get_ls1b();
                let treat_as_col = (board.turn && board.black_ss.get(sq)) || !board.white_ss.get(sq);
                board.can_move_ss[sq].ande((treat_as_col ? board.white_attack_ss : board.black_attack_ss).inverse());
            }
        }
    }
    reload_can_drop_piece_to();
}
function find_attackers() {
	//Clear all attackers
	board.white_attack_ss.zero();
    board.black_attack_ss.zero();
	//Find the attack spaces for each piece
    for (let a = 0; a < game_data.all_pieces.length; a ++){
        //Skip if we're peaceful
        if (game_data.all_pieces[a].attributes.includes(attrib.peaceful)) {
            continue;
        }
        for (let b = new squareset(board.piece_ss[a]); !b.is_zero(); b.pop()){
            let sq = b.get_ls1b();
            //Don't add attack if on pacifist
            if (game_data.pacifist.get(sq)) {
                continue;
            }
            let step_num = 0;
            let step = game_data.all_pieces[a].move[step_num];
            let treat_as_col = board.black_ss.get(sq) && (board.turn || !board.white_ss.get(sq));
            let my_attack = new squareset(game_data.width * game_data.height);
            for (let c = 0; c < step.length; c++) {
                let add = parse_term(step[c], 0, sq, a, treat_as_col, undefined, true);
                if (step[c][0].type === "sub") {
                    my_attack.ande(add.inverse());
                }
                else {
                    my_attack.ore(add);
                }
            }
            //Add to the ss
            treat_as_col ?
                board.black_attack_ss.ore(my_attack):
                board.white_attack_ss.ore(my_attack);
            //Cannot attack sanctuaries
            board.black_attack_ss.ande(game_data.sanctuary.inverse());
            board.white_attack_ss.ande(game_data.sanctuary.inverse());
		}
    }
}
function parse_term(term, term_index, sq, piece, col, angle, is_attack = false) {
    //Neutral pieces are whoever's turn it is; non-neutral pieces are their color
    if (angle === undefined) {
        angle = col ? 4 : 0;
    }
    let first = true
    let ret = new squareset(game_data.width * game_data.height);
    let saved_ss = new squareset(game_data.width * game_data.height);
    //Read the term token by token
    for (let a = term_index; a < term.length; a++) {
        if (term[a].type === "pre") {
            //Check condition, possibly return
            if (typeof (term[a].data) === "function" && term[a].data(col, sq, piece)) {
                return ss_or(ret, saved_ss);
            }
        } else if (term[a].type === "post") {
            //Filter squares in ret
            if (typeof (term[a].data) === "function") {
                if (!is_attack || term[a].at === undefined) {
                    let req_ss = term[a].data(col, sq, ret);
                    ret.ande(req_ss.inverse());
                }
                else if(term.findIndex((e, i) => e.type === "mol" && i > a) === -1) {
                    if (term[a].at) {
                        ret.zero();
                    }
                }
                else if(!term[a].at) {
                    let req_ss = term[a].data(col, sq, ret);
                    ret.ande(req_ss.inverse());
                }
            }

        } else if (term[a].type === "mol") {
            //If it's the first molecule, add the ss
            if (first) {
                ret.ore(game_data.move_ss[term[a].data][sq][angle]);
                first = false;
            }
            //Otherwise, call the function recursively for each square
            else {
                let resulting_spaces = new squareset(game_data.width * game_data.height);
                for (let b = new squareset(ret); !b.is_zero(); b.pop()) {
                    let new_sq = b.get_ls1b();
                    let cx = sq % game_data.width, cy = Math.floor(sq / game_data.width); //current x and y
                    let nx = new_sq % game_data.width, ny = Math.floor(new_sq / game_data.width); //new x and y
                    let new_ss = parse_term(term, a, new_sq, piece, col, angle_to(nx - cx, ny - cy), is_attack);
                    resulting_spaces.ore(new_ss);
                }
                //Since it's called recursively, the rest of the term has already been processed
                return ss_or(resulting_spaces, saved_ss);
            }
        } else if (term[a].type === "stop") {
            saved_ss.ore(ret);
        } else if (term[a].type === "rep") {
            a = term[a].data - 1; //Subtract 1 because it's about to be incremented
        }
    }
    return ss_or(ret, saved_ss);
}
function reload_can_drop_piece_to() {
    board.can_drop_piece_to = {white: [], black: []};
    board.can_drop = {white: false, black: false};
    for (let a = 0; a < game_data.all_pieces.length; a ++) {
        board.can_drop_piece_to.white.push(new squareset(game_data.width * game_data.height, 1));
        board.can_drop_piece_to.black.push(new squareset(game_data.width * game_data.height, 1));
        //File limit
        if (game_data.all_pieces[a].file_limit) {
            for (let b = 0; b < game_data.width; b ++) {
                //Count how many pieces of this type and color are in the column
                let in_col = {white: 0, black: 0};
                for (let c = 0; c < game_data.height; c ++) {
                    let sq = b + c * game_data.width;
                    if (board.piece_ss[a].get(sq)) {
                        board.white_ss.get(sq) && in_col.white ++;
                        board.black_ss.get(sq) && in_col.black ++;
                    }
                }
                if (in_col.white >= game_data.all_pieces[a].file_limit) {
                    for(let c = 0; c < game_data.height; c ++) {
                        board.can_drop_piece_to.white[a].set_off(b + c * game_data.width);
                    }
                }
                if (in_col.black >= game_data.all_pieces[a].file_limit) {
                    for(let c = 0; c < game_data.height; c ++) {
                        board.can_drop_piece_to.black[a].set_off(b + c * game_data.width);
                    }
                }
            }
        }
        //Zone limit
        board.can_drop_piece_to.white[a].ande(get_drop_zone(a, false));
        board.can_drop_piece_to.black[a].ande(get_drop_zone(a, true));
        //Can't land on other pieces
        board.can_drop_piece_to.white[a].ande(ss_or(board.white_ss, board.black_ss).inverse());
        board.can_drop_piece_to.black[a].ande(ss_or(board.white_ss, board.black_ss).inverse());
        //Set if we can drop or not
        if (!board.can_drop_piece_to.white[a].is_zero() && board.hands.white[a] > 0) {
            board.can_drop.white = true;
        }
        if (!board.can_drop_piece_to.black[a].is_zero() && board.hands.black[a] > 0) {
            board.can_drop.black = true;
        }
    }
}
function get_drop_zone(piece_id, color) {
    //console.log(`id: ${piece_id}, color: ${color}`)
    let zone_id = undefined;
    let piece = game_data.all_pieces[piece_id];
    if (piece.drop_to_zone != undefined && !isNaN(piece.drop_to_zone.white)) {
        zone_id = color ? piece.drop_to_zone.black : piece.drop_to_zone.white;
    }
    else if (game_data.drop_to_zone != undefined && !isNaN(game_data.drop_to_zone.white)) {
        zone_id = color ? game_data.drop_to_zone.black : game_data.drop_to_zone.white;
    }
    else {
        return game_data.active_squares;
    }
    if (game_data.zones.length <= zone_id) {
        show_error(`Zone ${zone_id} is undefined (found in drop_to_zone for ${game_data.all_pieces[piece_id].name})`)
    }
    return game_data.zones[zone_id];
}

function angle_to_diagonal(dx, dy) {
    if (dx === dy && dy === 0) { return 0; }
    if (dx === 0) {
        return (dy < 0) ? 0 : 4;
    }
    if (dx > 0) {
        return (dy < 0) ? 7 : (dy === 0) ? 6 : 5;
    }
    if (dx < 0) {
        return (dy < 0) ? 1 : (dy === 0) ? 2 : 3;
    }
    return 0;
}
function angle_to_orthogonal(dx, dy) {
    if (dx === dy && dy === 0) { return 0; }
    if (dy < -Math.abs(dx)) { return 0; }
    if (dy > Math.abs(dx)) { return 4; }
    if (dx < -Math.abs(dy)) { return 2; }
    if (dx > Math.abs(dy)) { return 6; }
    if (dx === dy)  { return (dx < 0) ? 1 : 5; }
    if (dx === -dy) { return (dx < 0) ? 3 : 7; }
    return 0;
}
function angle_to_clockwise(dx, dy) {
    if (dx === dy && dy === 0) { return 0; }
    if (dx >= 0 && dy < 0) {
        if (Math.abs(dx) < Math.abs(dy)) { return 0; }
        else { return 7; }
    }
    if (dx > 0 && dy >= 0) {
        if (Math.abs(dx) > Math.abs(dy)) { return 6; }
        else { return 5; }
    }
    if (dx <= 0 && dy > 0) {
        if (Math.abs(dx) < Math.abs(dy)) { return 4; }
        else { return 3; }
    }
    if (dx < 0 && dy <= 0) {
        if (Math.abs(dx) > Math.abs(dy)) { return 2; }
        else { return 1; }
    }
    return 0;
}
function angle_to_counterclockwise(dx, dy) {
    if (dx === dy && dy === 0) { return 0; }
    if (dx <= 0 && dy < 0) {
        return (dx <= dy) ? 1 : 0;
    }
    if (dx < 0 && dy >= 0) {
        return (dx < -dy) ? 2 : 3;
    }
    if (dx >= 0 && dy > 0) {
        return (dx >= dy) ? 5 : 4;
    }
    if (dx > 0 && dy <= 0) {
        return (dx > -dy) ? 6 : 7;
    }
    return 0;
}
function angle_to(dx, dy) {
    switch (game_data.snap_mode) {
        case "diagonal":
            return angle_to_diagonal(dx, dy);
            break;
        case "orthogonal":
            return angle_to_orthogonal(dx, dy);
            break;
        case "counterclockwise":
            return angle_to_counterclockwise(dx, dy);
            break;
        default:
            return angle_to_clockwise(dx, dy);
            break;
    }
}
function print_angles(fn) {
    let ret = "";
    for (let y = -3; y < 4; y++) {
        for (let x = -3; x < 4; x++) {
            ret += fn(x, y) + " ";
        }
        ret += "\n";
    }
    console.log(ret);
} 