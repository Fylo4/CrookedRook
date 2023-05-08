function make_move(src_x, src_y, dst_x, dst_y, promotion) {
    //console.log(`Make move params: src_x=${src_x}; src_y=${src_y}; dst_x=${dst_x}; dst_y=${dst_y}; prom=${promotion}`);

    if (src_x === undefined || src_y === undefined || dst_x === undefined || dst_y === undefined) {
        show_error("Error occurred while trying to make move (<4 params). You should report this in #bug-reports.");
        return;
    }
    if (typeof(src_x) != "number" || typeof(src_y) != "number" || typeof(dst_x) != "number" || typeof(dst_y) != "number") {
        show_error(`Error occurred while trying to make move (non-number). You should report this in #bug-reports. Data: ${src_x}, ${src_y}, ${dst_x}, ${dst_y}`);
        return;
    }
    if(!validate_move(src_x, src_y, dst_x, dst_y, promotion)) {
        show_error("Error occurred while trying to make move (invalid move). You should report this in #bug-reports.");
        return;
    }

    board = cloneBoard(board_history[view_move]);

    let src_sq = src_y * game_data.width + src_x;
    let dst_sq = dst_y * game_data.width + dst_x;
    let this_id = identify_piece(src_sq);
    if (this_id === -1) {
        show_error("Error occured while trying to make move (source piece undefined). You should report this in #bug-reports.");
        return;
    }
    let this_piece = game_data.all_pieces[this_id];
    let is_white = board.white_ss.get(src_sq);
    let is_black = board.black_ss.get(src_sq);
    let my_space = src_sq;
    let other_space = dst_sq;

    //Variables needed for notation
    //Find how many pieces can go to the same spot
    let in_same_row = false, in_same_column = false, needs_specification = false;
    let other_pieces = ss_and(board.turn ? board.black_ss : board.white_ss, board.piece_ss[this_id]);
    for (; !other_pieces.is_zero(); other_pieces.pop()) {
        let pos = other_pieces.get_ls1b();
        if (pos === src_sq) { continue; }
        if (!board.can_move_ss[pos].get(dst_sq)) { continue; }
        needs_specification = true;
        if (Math.floor(pos / game_data.width) === Math.floor(src_sq / game_data.width)) {
            in_same_row = true;
        }
        if ((pos % game_data.width) === (src_sq % game_data.width)) {
            in_same_column = true;
        }
    }
    let is_capture = false;
    let promote_notation = "";
    //Continued at end

    if (src_sq === dst_sq) {
        //Lands on self
        if (get_attributes(this_piece).includes(attrib.retreat)) {
            death(src_sq, false);
            is_capture = true;
        }
    }
    else if ((board.turn && board.black_ss.get(dst_sq) && !board.white_ss.get(dst_sq)) ||
        (!board.turn && board.white_ss.get(dst_sq) && !board.black_ss.get(dst_sq))) {
        //Lands on ally (not neutral)
        let other_piece = game_data.all_pieces[identify_piece(dst_sq)];
        if (get_attributes(this_piece).includes(attrib.castle_from) && get_attributes(other_piece).includes(attrib.castle_to)) {
            //Castle
            let delta_x = dst_x - src_x, delta_y = dst_y - src_y;
            let delta_gcd = Math.abs(gcd(delta_x, delta_y));
            delta_x /= delta_gcd; delta_y /= delta_gcd;
            let king_dest_x = src_x + delta_x * game_data.castle_length;
            let king_dest_y = src_y + delta_y * game_data.castle_length;
            let rook_dest_x = king_dest_x - delta_x;
            let rook_dest_y = king_dest_y - delta_y;
            let king_sq = king_dest_y * game_data.width + king_dest_x;
            let rook_sq = rook_dest_y * game_data.width + rook_dest_x;

            if (king_sq === rook_sq) {
                show_error("Trying to castle on self");
            }
            else if (!on_board(king_sq) || !on_board(rook_sq)) {
                show_error("Trying to castle to non-existent space");
            }
            else if (king_sq != dst_sq && (board.black_ss.get(king_sq) || board.white_ss.get(king_sq))) {
                show_error("Trying to castle king to occupied space");
            }
            else if (rook_sq != src_sq && rook_sq != dst_sq && (board.black_ss.get(rook_sq) || board.white_ss.get(rook_sq))) {
                show_error("Trying to castle rook to occupied space");
            }
            else {
                //Castle successful
                let rook_current = dst_sq;
                if (src_sq != king_sq) {
                    swap_spaces(src_sq, king_sq);
                    if (king_sq === dst_sq) {
                        rook_current = src_sq;
                    }
                }
                if (dst_sq != rook_sq && (src_sq != rook_sq || dst_sq != king_sq)) {
                    swap_spaces(rook_current, rook_sq);
                }
                my_space = king_sq;
                other_space = rook_sq;
            }
        }
        else if (!get_attributes(this_piece).includes(attrib.ally_static)) {
            swap_spaces(src_sq, dst_sq);
            other_space = src_sq;
            my_space = dst_sq;
        }
        else {
            board.has_moved_ss.set_on(src_sq);
        }
        if (get_attributes(this_piece).includes(attrib.kill_ally)) {
            death(other_space, false);
            is_capture = true;
        }
    }
    else if ((board.turn && board.white_ss.get(dst_sq)) || (!board.turn && board.black_ss.get(dst_sq))) {
        //Lands on enemy
        let other_piece = game_data.all_pieces[identify_piece(dst_sq)];
        if (!get_attributes(this_piece).includes(attrib.enemy_static)) {
            swap_spaces(src_sq, dst_sq);
            other_space = src_sq;
            my_space = dst_sq;
        }
        else {
            board.has_moved_ss.set_on(src_sq);
        }
        board.has_attacked_ss.set_on(my_space);
        if (get_attributes(this_piece).includes(attrib.flip_this_on_attack)) {
            if (board.black_ss.get(my_space) != board.white_ss.get(my_space)) {
                board.black_ss.flip(my_space);
                board.white_ss.flip(my_space);
                is_white = !is_white;
                is_black = !is_black;
            }
        }
        let spawn_col = (is_white && is_black) ? 2 : is_black;
        if (get_attributes(this_piece).includes(attrib.promote_on_attack) && this_piece.held_piece >= 0
            && this_piece.held_piece < game_data.all_pieces.length && slots_left(this_piece.held_piece, spawn_col)) {
            clear_space(my_space);
            spawn_piece(my_space, this_piece.held_piece, spawn_col);
            board.has_moved_ss.set_on(my_space);
            let new_piece = game_data.all_pieces[this_piece.held_piece];
            promote_notation = "=" + (new_piece.notation ?? new_piece.symbol);
            //Old values of this_piece and piece_id should be used, so don't update them
        }
        if (!get_attributes(this_piece).includes(attrib.save_enemy)) {
            death(other_space, false, !get_attributes(this_piece).includes(attrib.dont_flip_enemy));
            is_capture = true;
        }
        else if (!get_attributes(this_piece).includes(attrib.dont_flip_enemy)) {
            board.black_ss.flip(other_space);
            board.white_ss.flip(other_space);
        }
        if (get_attributes(this_piece).includes(attrib.fireball) || get_attributes(other_piece).includes(attrib.bomb)) {
            death(my_space, false);
        }
        if (get_attributes(this_piece).includes(attrib.burn_attack)) {
            is_capture ||= evaluate_burns(this_id, my_space, board.turn);
        }
    }
    else if (!board.white_ss.get(dst_sq) && !board.black_ss.get(dst_sq)) {
        //Lands on blank
        swap_spaces(src_sq, dst_sq);
        other_space = src_sq;
        my_space = dst_sq;
        if (get_attributes(this_piece).includes(attrib.burn_peaceful)) {
            is_capture ||= evaluate_burns(this_id, dst_sq, board.turn);
        }
        if (get_attributes(this_piece).includes(attrib.flip_on_passive)) {
            //Only flip if there's a piece there
            if (board.black_ss.get(dst_sq) || board.white_ss.get(dst_sq)) {
                board.black_ss.flip(dst_sq);
                board.white_ss.flip(dst_sq);
            }
        }
    }

    //En passant
    if (get_attributes(this_piece).includes(attrib.ep_capturer) && board.ep_mask.get(my_space)) {
        let other_white = board.white_ss.get(board.last_moved_dest), other_black = board.black_ss.get(board.last_moved_dest);
        if ((!get_attributes(this_piece).includes(attrib.save_enemy) && ((board.turn && other_white) || (!board.turn && other_black)))
            || ((get_attributes(this_piece).includes(attrib.kill_ally) && ((board.turn && other_white) || (!board.turn && other_black))))) {
            //If it's an enemy and I can kill enemies, or it's an ally and I can kill allies
            death(board.last_moved_dest, false);
            is_capture = true;
        }
    }

    //Kill between
    let kill = new squareset(game_data.width * game_data.height);
    if (get_attributes(this_piece).includes(attrib.kill_between)) {
        kill.ore(get_ep_ss(src_sq, dst_sq, game_data.precompute));
        if (get_attributes(this_piece).includes(attrib.save_enemy)) {
            kill.ande(board.turn ? board.white_ss.inverse() : board.black_ss.inverse());
        }
        if (!get_attributes(this_piece).includes(attrib.kill_ally)) {
            kill.ande(board.turn ? board.black_ss.inverse() : board.white_ss.inverse());
        }
        kill.ande(ss_or(board.white_ss, board.black_ss));
    }
    for (; !kill.is_zero(); kill.pop()) {
        death(kill.get_ls1b(), true);
        is_capture = true;
    }

    //Spawn_trail, then spawn_constant
    if (get_attributes(this_piece).includes(attrib.spawn_trail)) {
        if (!board.black_ss.get(other_space) && !board.white_ss.get(other_space)) {
            let spawn_col = (is_white && is_black) ? 2 : is_black;
            if(slots_left(this_piece.held_piece, spawn_col)) {
                spawn_piece(other_space, this_piece.held_piece, spawn_col)
            }
        }
    }
    for (let a = get_constant_spawn_ss(); !a.is_zero(); a.pop()) {
        //Treat as col determines the orientation of the spawning squareset
        //Spawn col determines color of the pieces it spawns
        let sq = a.get_ls1b();
        let piece = game_data.all_pieces[identify_piece(sq)];
        let treat_as_col = board.black_ss.get(sq) && (!board.white_ss.get(sq) || board.turn);
        let spawn_col = (board.white_ss.get(sq) && board.black_ss.get(sq)) ? 2 : board.black_ss.get(sq);
        let spawn_ss = new squareset(get_move_ss(piece.held_move, sq, treat_as_col ? 4 : 0));
        spawn_ss.ande(ss_or(board.black_ss, board.white_ss).inverse());
        let pop_count = spawn_ss.count_bits() - slots_left(piece.held_piece, spawn_col);
        for (let b = 0; b < pop_count; b ++) {
            spawn_ss.pop();
        }
        for (; !spawn_ss.is_zero(); spawn_ss.pop()) {
            spawn_piece(spawn_ss.get_ls1b(), piece.held_piece, spawn_col);
        }
    }

    //Passive burn
    let burn_white = new squareset(game_data.width * game_data.height);
    let burn_black = new squareset(game_data.width * game_data.height);
    for (let a = get_passive_burn_ss(); !a.is_zero(); a.pop()) {
        //Neutral piece's burn direction is based on whose turn it is
        //But neutral pieces burn both sides
        let sq = a.get_ls1b();
        let piece = game_data.all_pieces[identify_piece(sq)];
        let treat_as_col = board.black_ss.get(sq) && (!board.white_ss.get(sq) || board.turn);
        if (board.black_ss.get(sq) || get_attributes(piece).includes(attrib.burn_allies)) {
            burn_white.ore(get_move_ss(piece.held_move, sq, treat_as_col ? 4 : 0));
        }
        if (board.white_ss.get(sq) || get_attributes(piece).includes(attrib.burn_allies)) {
            burn_black.ore(get_move_ss(piece.held_move, sq, treat_as_col ? 4 : 0));
        }
    }
    let burn = ss_or(ss_and(burn_white, board.white_ss), ss_and(burn_black, board.black_ss));
    burn.ande(get_burn_immune_ss().inverse());
    for (; !burn.is_zero(); burn.pop()) {
        death(burn.get_ls1b(), true);
        is_capture = true;
    }

    //Promotions
    let my_promotion = -1;
    if (board.piece_ss[this_id].get(my_space)) {
        let promote_to = find_promotions(this_id, src_sq, my_space, board.white_ss.get(my_space), board.black_ss.get(my_space));
        //Promote_to is all pieces this piece can currently promote to
        if (promote_to.length === 1) {
            my_promotion = promote_to[0];
        }
        else if (promotion != undefined && promote_to.includes(promotion)) {
            //If the passed-in promotion value is in the promote_to array, promote to that
            my_promotion = promotion;
        }
        else if (promote_to.length > 1) {
            //Something went wrong, promote to the first possible piece and throw an error
            show_error("Piece promotion not found, promoting to first possible promotion. You should report this in #bug-reports");
            my_promotion = promote_to[0];
        }
        if (my_promotion >= 0) {
            let spawn_col = (board.white_ss.get(my_space) && board.black_ss.get(my_space)) ? 2 : board.black_ss.get(my_space);
            clear_space(my_space);
            spawn_piece(my_space, my_promotion, spawn_col);
            board.has_moved_ss.set_on(my_space);
            let new_piece = game_data.all_pieces[my_promotion];
            promote_notation = "=" + (new_piece.notation ?? new_piece.symbol);
            //Promote from opp hand
            if (get_attributes(this_piece).includes(attrib.promote_from_opp_hand) && game_data.has_hand){
                let opp_hand = (spawn_col == 1) ? board.hands.white :
                    (spawn_col == 0) ? board.hands.black :
                    board.turn ? board.hands.white : board.hands.black;
                if (opp_hand[my_promotion] > 0) {
                    opp_hand[my_promotion] --;
                }
            }
        }
    }

    //Notation continued
    let notation = this_piece.notation ?? this_piece.symbol;
    if (!needs_specification) {
        //Still specify if it's a capture and we have no notation (e.g. pawn)
        if(is_capture && this_piece.notation === "") {
            notation += file(src_sq%game_data.width);
        }
    }
    else if (!in_same_column) {
        notation += file(src_sq%game_data.width);
    }
    else if (!in_same_row && this_piece.notation != "") {
        notation += rank(Math.floor(src_sq/game_data.width));
    }
    else {
        notation += file(src_sq % game_data.width) + rank(Math.floor(src_sq / game_data.width));
    }
    //Captures
    if (is_capture) {
        notation += "x";
    }
    //To space
    notation += file(dst_sq % game_data.width) + rank(Math.floor(dst_sq / game_data.width));
    notation += promote_notation;

    //Leave EP mask
    if (get_attributes(this_piece).includes(attrib.ep_captured)) {
        board.ep_mask = new squareset(get_ep_ss(src_sq, my_space, game_data.precompute));
    }
    else {
        board.ep_mask.zero();
    }

    let history_record = { x1: src_x, y1: src_y, x2: dst_x, y2: dst_y, turn: board.turn_count, notation: notation };
    if (my_promotion >= 0) { history_record.promotion = my_promotion; }
    post_move(src_sq, dst_sq, history_record, this_id);
}

function make_drop_move(piece, color, dest, promotion) {
    if(!validate_drop(piece, color, dest)) {
        show_error("make_drop_move called with invalid data. You should report this in #bug-reports.");
        return;
    }
    //Promotion should always be undefined until I implement drop promotions
    if(promotion != undefined) {
        show_error("Drop promotions aren't implemented yet");
        return;
    }
    let my_hand = color ? board.hands.black : board.hands.white;

    spawn_piece(dest, promotion ?? piece, color);
    board.has_moved_ss.set_on(dest);
    my_hand[piece]--;

    let piece_symbol = game_data.all_pieces[promotion ?? piece].notation ?? game_data.all_pieces[promotion ?? piece].symbol;
    let notation = piece_symbol + "'" + file(dest % game_data.width) + rank(Math.floor(dest / game_data.width));

    board.ep_mask.zero(); //Dropped pieces can't be captured EP
    post_move(-1, dest, { piece: piece, color: color, dest: dest, turn: board.turn_count, drop: true, notation: notation }, piece);
}

function validate_move(src_x, src_y, dst_x, dst_y, promotion) {
    let brd = board_history[view_move];
    let src_sq = src_y * game_data.width + src_x;
    let dst_sq = dst_y * game_data.width + dst_x;
    
    let color = (brd.black_ss.get(src_sq) && brd.white_ss.get(src_sq)) ? brd.turn : brd.black_ss.get(src_sq);
    if (!can_move(color, brd)) {
        show_error("Player cannot move pieces. You should report this in #bug-reports.");
        return false;
    }

    //If a piece of turn's color isn't on src
    if(brd.turn && !brd.black_ss.get(src_sq) || !brd.turn && !brd.white_ss.get(src_sq)) {
        show_error("Wrong color in move validation. You should report this in #bug-reports.");
        return false;
    }
    //If the piece can't move there
    if(!brd.can_move_ss[src_sq].get(dst_sq)) {
        show_error("Invalid move. You should report this in #bug-reports.");
        return false;
    }
    return true;
}

function validate_drop(piece, color, dest) {
    let brd = board_history[view_move];
    let my_hand = color ? brd.hands.black : brd.hands.white;
    if (my_hand[piece] <= 0) {
        show_error("Trying to drop a piece you don't have");
        return false;
    }
    if (color != brd.turn) {
        show_error("Trying to drop a piece when it isn't your turn");
        return false;
    }
    if (brd.white_ss.get(dest) || brd.black_ss.get(dest)) {
        show_error("Trying to drop a piece on another piece");
        return false;
    }
    let drop_zone = color ?
        board.can_drop_piece_to.black[piece]:
        board.can_drop_piece_to.white[piece];
    if(!drop_zone.get(dest)) {
        show_error("Trying to drop a piece outside of your drop zone");
        return false;
    }
    if(slots_left(piece, color, brd) <= 0) {
        show_error("Trying to drop a piece which is at limit");
        return false;
    }
    return true;
}

function post_move(src, dest, history_record, piece_id) {
    let current_turn = board.turn;
    board.last_moved_col = board.turn;
    board.turn_pos++;
    if (board.turn_pos >= game_data.turn_list.length) {
        board.turn_pos = 0;
        board.turn_count++;
    }
    board.turn = game_data.turn_list[board.turn_pos];
    board.last_moved_src = src;
    board.last_moved_dest = dest;
    board.copycat_memory = piece_id;
    refresh_moves();
    if ((current_turn && !board.checked.white.is_zero()) || (!current_turn && !board.checked.black.is_zero())) {
        history_record.notation += "+";
    }
    board.victory = find_victory();
    board_history.length = view_move + 1;
    move_history.length = view_move;
    view_move++;
    board_history.push(cloneBoard());
    move_history.push(history_record);
    render_extras();
}
function find_victory() {
    //Royal Capture
    //If your royal gets captured, you lose
    if (game_data.wins.includes(ends.royal_capture)) {
        if (!board.royals_killed.white && board.royals_killed.black) {
            show_message("Black wins by royal capture")
            return 1; //Black wins
        }
        if (board.royals_killed.white && !board.royals_killed.black) {
            show_message("White wins by royal capture")
            return 0; //White wins
        }
        if (board.royals_killed.white && board.royals_killed.black) {
            show_message("Mutual win by royal capture")
            return 0.5; //Draw
        }
    }
    if (game_data.draws.includes(ends.royal_capture)) {
        if (board.royals_killed.white || board.royals_killed.black) {
            show_message("Draw by royal capture")
            return 0.5; //Not sure why this would ever be a thing
        }
    }
    //Royal Extinction
    //If you have no royal pieces, you lose
    let all_royals = new squareset(game_data.width * game_data.height);
    for (let a = 0; a < game_data.all_pieces.length; a++) {
        if (get_attributes(a).includes(attrib.royal)) {
            all_royals.ore(board.piece_ss[a]);
        }
    }
    if (game_data.wins.includes(ends.royal_extinction)) {
        if (ss_and(all_royals, board.white_ss).is_zero() && !ss_and(all_royals, board.black_ss).is_zero()) {
            show_message("Black wins by royal extinction")
            return 1; //Black wins
        }
        if (ss_and(!all_royals, board.white_ss).is_zero() && ss_and(all_royals, board.black_ss).is_zero()) {
            show_message("White wins by royal extinction")
            return 0; //White wins
        }
        if (ss_and(all_royals, board.white_ss).is_zero() && ss_and(all_royals, board.black_ss).is_zero()) {
            show_message("Mutual win by royal extinction")
            return 0.5; //Draw
        }
    }
    if (game_data.draws.includes(ends.royal_extinction)) {
        if (ss_and(all_royals, board.white_ss).is_zero() || ss_and(all_royals, board.black_ss).is_zero()) {
            show_message("Draw by royal extinction")
            return 0.5; //Not sure why this would ever be a thing
        }
    }
    //Bare Royals
    //If you have no non-royal pieces, you lose
    if (game_data.wins.includes(ends.bare_royal)) {
        if (ss_and(all_royals.inverse(), board.white_ss).is_zero() && !ss_and(all_royals.inverse(), board.black_ss).is_zero()) {
            show_message("Black wins by bare royal")
            return 1; //Black wins
        }
        if (ss_and(!all_royals.inverse(), board.white_ss).is_zero() && ss_and(all_royals.inverse(), board.black_ss).is_zero()) {
            show_message("White wins by bare royal")
            return 0; //White wins
        }
        if (ss_and(all_royals.inverse(), board.white_ss).is_zero() && ss_and(all_royals.inverse(), board.black_ss).is_zero()) {
            show_message("Mutual win by bare royal")
            return 0.5; //Draw
        }
    }
    if (game_data.draws.includes(ends.bare_royal)) {
        if (ss_and(all_royals.inverse(), board.white_ss).is_zero() || ss_and(all_royals.inverse(), board.black_ss).is_zero()) {
            show_message("Draw by bare royal")
            return 0.5;
        }
    }
    //Stalemate
    let has_possible_moves = { white: false, black: false };
    for (let a = 0; a < game_data.width * game_data.height; a++) {
        if (!board.can_move_ss[a].is_zero()) {
            if (board.black_ss.get(a)) {
                has_possible_moves.black = true;
            }
            if (board.white_ss.get(a)) {
                has_possible_moves.white = true;
            }
        }
        if (has_possible_moves.white && has_possible_moves.black) {
            break;
        }
    }
    if (game_data.has_hand) {
        has_possible_moves.white |= board.can_drop.white;
        has_possible_moves.black |= board.can_drop.black;
    }
    if (game_data.wins.includes(ends.stalemate) || game_data.draws.includes(ends.stalemate)) {
        if (!board.turn && !has_possible_moves.white) {
            if (game_data.draws.includes(ends.stalemate)) {
                show_message("Draw by stalemate")
                return 0.5; //Black wins
            }
            show_message("Black by stalemate")
            return 1; //Black wins
        }
        if (board.turn && !has_possible_moves.black) {
            if (game_data.draws.includes(ends.stalemate)) {
                show_message("Draw by stalemate")
                return 0.5; //Black wins
            }
            show_message("White by stalemate")
            return 0; //White wins
        }
    }
    return -1;
}
//Finds how many pieces can still be placed, considering piece.limit
//Color = 0/false, 1/true, or 2 = white, black, neutral respectively
//Any other color value applies it to all pieces combined
function slots_left (piece_id, color, brd) {
    if(brd === undefined) {
        brd = board;
    }
    if(piece_id < 0 || piece_id >= game_data.all_pieces.length) {
        return 0;
    }
    if(board === undefined) {
        brd = board;
    }
    let limit = game_data.all_pieces[piece_id].limit;
    if(limit === undefined) {
        return 1000000;
    }
    let col_ss = (color == 0) ? brd.white_ss :
        (color == 1) ? brd.black_ss : 
        (color == 2) ? ss_and(brd.black_ss, brd.white_ss) :
        ss_or(brd.black_ss, brd.white_ss);
    let pieces_placed = ss_and(brd.piece_ss[piece_id], col_ss);
    return Math.max(limit - pieces_placed.count_bits(), 0);
}

//Returns true if any pieces are captured
function evaluate_burns(piece_id, sq, col) {
    let burn = new squareset(get_move_ss(game_data.all_pieces[piece_id].held_move, sq, col ? 4 : 0));
    burn = ss_and(burn, ss_or(board.black_ss, board.white_ss), get_burn_immune_ss().inverse());
    let has_captured = false;
    if (!get_attributes(piece_id).includes(attrib.burn_allies)) {
        let my_ss = col ? board.black_ss : board.white_ss;
        burn.ande(my_ss.inverse());
    }
    for (; !burn.is_zero(); burn.pop()) {
        death(burn.get_ls1b(), true);
        has_captured = true;
    }
    return has_captured;
}
function death(sq, is_burn = false, flip = true) {
    let piece_id = identify_piece(sq);
    let piece = game_data.all_pieces[piece_id];
    let is_neutral = board.black_ss.get(sq) && board.white_ss.get(sq);
    let burn_col = is_neutral ? !board.turn : board.black_ss.get(sq);
    let spawn_col = is_neutral ? 2 : board.black_ss.get(sq);

    if (get_attributes(piece).includes(attrib.dont_flip_on_death)) {
        flip = false;
    }

    if (get_attributes(piece).includes(attrib.transform_on_death)) {
        if(!get_attributes(piece).includes(attrib.save_self) || slots_left(piece.held_piece, spawn_col)) {
            clear_space(sq);
            spawn_piece(sq, piece.held_piece, spawn_col);
            board.has_moved_ss.set_on(sq);
        }
    }
    if (flip && !is_neutral) {
        board.black_ss.flip(sq);
        board.white_ss.flip(sq);
    }
    if (!get_attributes(piece).includes(attrib.save_self)) {
        if ((game_data.has_hand && !is_neutral) &&
            ((!is_burn && !game_data.destroy_on_capture && !get_attributes(piece).includes(attrib.destroy_on_capture)) ||
            (is_burn && !game_data.destroy_on_burn && !get_attributes(piece).includes(attrib.destroy_on_burn)))) {
            if (board.black_ss.get(sq)) {
                board.hands.black[identify_piece(sq)]++;
            }
            else if (board.white_ss.get(sq)) {
                board.hands.white[identify_piece(sq)]++;
            }
        }
        clear_space(sq);
    }

    if (get_attributes(piece).includes(attrib.burn_death)) {
        evaluate_burns(piece_id, sq, burn_col);
    }
    if (get_attributes(piece).includes(attrib.spawn_on_death)) {
        let spawns = new squareset(get_move_ss(piece.held_move, sq, burn_col ? 4 : 0));
        spawns.ande(ss_or(board.black_ss, board.white_ss).inverse());
        let pop_count = spawns.count_bits() - slots_left(piece.held_piece, spawn_col);
        for (let b = 0; b < pop_count; b ++) {
            spawns.pop();
        }
        for (; !spawns.is_zero(); spawns.pop()) {
            spawn_piece(spawns.get_ls1b(), piece.held_piece, spawn_col);
        }
    }

    if (get_attributes(piece).includes(attrib.royal)) {
        //Whoever's turn it is gets a royals_killed point
        if (board.turn) {
            board.royals_killed.black++;
        }
        else {
            board.royals_killed.white++;
        }
    }
}
function spawn_piece(sq, piece_id, col) {
    if (board.white_ss.get(sq) || board.black_ss.get(sq)) {
        return;
    }
    if (game_data.all_pieces[piece_id].file_limit) {
        if (count_pieces_in_column(piece_id, sq%game_data.width, (col === 2) ? undefined : col) >= game_data.all_pieces[piece_id].file_limit) {
            return;
        }
    }
    board.piece_ss[piece_id].set_on(sq);
    if (col == 0 || col == 2) {
        board.white_ss.set_on(sq);
    }
    if (col == 1 || col == 2) {
        board.black_ss.set_on(sq);
    }
    let attributes = get_attributes(piece_id);
    if (!attributes.includes(attrib.ghost)) {
        board.solid_ss.set_on(sq);
    }
    if (attributes.includes(attrib.iron)) {
        board.iron_ss.set_on(sq);
    }
    if (attributes.includes(attrib.tall)) {
        board.tall_ss.set_on(sq);
    }
    if (attributes.includes(attrib.royal)) {
        board.royal_ss.set_on(sq);
    }
    if (attributes.includes(attrib.burn_passive)) {
        board.passive_burn_ss.set_on(sq);
    }
    if (attributes.includes(attrib.burn_immune)) {
        board.burn_immune_ss.set_on(sq);
    }
    if (attributes.includes(attrib.spawn_constant)) {
        board.constant_spawn_ss.set_on(sq);
    }
    board.has_moved_ss.set_off(sq);
    board.has_attacked_ss.set_off(sq);
}
function swap_spaces(src, dest) {
    swap_ss_space(src, dest, board.black_ss);
    swap_ss_space(src, dest, board.white_ss);
    swap_ss_space(src, dest, board.solid_ss);
    swap_ss_space(src, dest, board.iron_ss);
    swap_ss_space(src, dest, board.tall_ss);
    swap_ss_space(src, dest, board.royal_ss);
    swap_ss_space(src, dest, board.passive_burn_ss);
    swap_ss_space(src, dest, board.burn_immune_ss);
    swap_ss_space(src, dest, board.constant_spawn_ss);
    swap_ss_space(src, dest, board.has_attacked_ss);
    for (let a = 0; a < game_data.all_pieces.length; a++) {
        swap_ss_space(src, dest, board.piece_ss[a]);
    }
    board.has_moved_ss.set_on(src);
    board.has_moved_ss.set_on(dest);
}
function clear_space(sq) {
    board.black_ss.set_off(sq);
    board.white_ss.set_off(sq);
    board.solid_ss.set_off(sq);
    board.iron_ss.set_off(sq);
    board.tall_ss.set_off(sq);
    board.royal_ss.set_off(sq);
    board.passive_burn_ss.set_off(sq);
    board.burn_immune_ss.set_off(sq);
    board.constant_spawn_ss.set_off(sq);
    board.has_attacked_ss.set_off(sq);
    board.has_moved_ss.set_off(sq);
    for (let a = 0; a < game_data.all_pieces.length; a++) {
        board.piece_ss[a].set_off(sq);
    }
}
function swap_ss_space(src, dest, ss) {
    let temp = ss.get(src);
    ss.set(src, ss.get(dest));
    ss.set(dest, temp);
}
//Returns ID of piece at given square
function identify_piece(sq, brd) {
    if (brd === undefined) {
        brd = board;
    }
    for (let a = 0; a < game_data.all_pieces.length; a++) {
        if (brd.piece_ss[a].get(sq)) {
            return a;
        }
    }
    return -1;
}
