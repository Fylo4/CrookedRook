import { Board } from "./Board";
import { GameRules, PieceAttributes } from "../Constants";
import { Squareset, ss_and, ss_or } from "../Squareset";
import { get_ep_ss } from "../bnb_ep_init";
import { file, gcd, rank } from "../utils";

//Board should be cloneBoard(board_history[view_move])
export function _make_move(board: Board, src_x: number, src_y: number, dst_x: number, dst_y: number, promotion?: number): HistoryRecord {
    //console.log(`Make move params: src_x=${src_x}; src_y=${src_y}; dst_x=${dst_x}; dst_y=${dst_y}; prom=${promotion}`);

    if(!validate_move(board, src_x, src_y, dst_x, dst_y, promotion)) {
        throw new Error("Error occurred while trying to make move: invalid move");
    }

    let src_sq = src_y * board.game_data.width + src_x;
    let dst_sq = dst_y * board.game_data.width + dst_x;
    let this_id = board.identify_piece(src_sq);
    if (this_id === -1) {
        throw new Error("Error occured while trying to make move: source piece undefined");
    }
    let this_piece = board.game_data.all_pieces[this_id];
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
        if (Math.floor(pos / board.game_data.width) === Math.floor(src_sq / board.game_data.width)) {
            in_same_row = true;
        }
        if ((pos % board.game_data.width) === (src_sq % board.game_data.width)) {
            in_same_column = true;
        }
    }
    let is_capture = false;
    let promote_notation = "";
    //Continued at end

    if (src_sq === dst_sq) {
        //Lands on self
        if (board.get_attributes(this_piece).includes(PieceAttributes.retreat)) {
            death(board, src_sq, false);
            is_capture = true;
        }
    }
    else if ((board.turn && board.black_ss.get(dst_sq) && !board.white_ss.get(dst_sq)) ||
        (!board.turn && board.white_ss.get(dst_sq) && !board.black_ss.get(dst_sq))) {
        //Lands on ally (not neutral)
        let other_piece = board.game_data.all_pieces[board.identify_piece(dst_sq)];
        if (board.get_attributes(this_piece).includes(PieceAttributes.castle_from) && 
            board.get_attributes(other_piece).includes(PieceAttributes.castle_to)) {
            //Castle
            let delta_x = dst_x - src_x, delta_y = dst_y - src_y;
            let delta_gcd = Math.abs(gcd(delta_x, delta_y));
            delta_x /= delta_gcd; delta_y /= delta_gcd;
            let king_dest_x = src_x + delta_x * board.game_data.castle_length;
            let king_dest_y = src_y + delta_y * board.game_data.castle_length;
            let rook_dest_x = king_dest_x - delta_x;
            let rook_dest_y = king_dest_y - delta_y;
            let king_sq = king_dest_y * board.game_data.width + king_dest_x;
            let rook_sq = rook_dest_y * board.game_data.width + rook_dest_x;

            if (king_sq === rook_sq) {
                throw new Error("Trying to castle on self");
            }
            else if (!board.on_board(king_sq) || !board.on_board(rook_sq)) {
                throw new Error("Trying to castle to non-existent space");
            }
            else if (king_sq != dst_sq && (board.black_ss.get(king_sq) || board.white_ss.get(king_sq))) {
                throw new Error("Trying to castle king to occupied space");
            }
            else if (rook_sq != src_sq && rook_sq != dst_sq && (board.black_ss.get(rook_sq) || board.white_ss.get(rook_sq))) {
                throw new Error("Trying to castle rook to occupied space");
            }
            else {
                //Castle successful
                let rook_current = dst_sq;
                if (src_sq != king_sq) {
                    board.swap_spaces(src_sq, king_sq);
                    if (king_sq === dst_sq) {
                        rook_current = src_sq;
                    }
                }
                if (dst_sq != rook_sq && (src_sq != rook_sq || dst_sq != king_sq)) {
                    board.swap_spaces(rook_current, rook_sq);
                }
                my_space = king_sq;
                other_space = rook_sq;
            }
        }
        else if (!board.get_attributes(this_piece).includes(PieceAttributes.ally_static)) {
            board.swap_spaces(src_sq, dst_sq);
            other_space = src_sq;
            my_space = dst_sq;
        }
        else {
            board.has_moved_ss.set_on(src_sq);
        }
        if (board.get_attributes(this_piece).includes(PieceAttributes.kill_ally)) {
            death(board, other_space, false);
            is_capture = true;
        }
    }
    else if ((board.turn && board.white_ss.get(dst_sq)) || (!board.turn && board.black_ss.get(dst_sq))) {
        //Lands on enemy
        let other_piece = board.game_data.all_pieces[board.identify_piece(dst_sq)];
        if (!board.get_attributes(this_piece).includes(PieceAttributes.enemy_static)) {
            board.swap_spaces(src_sq, dst_sq);
            other_space = src_sq;
            my_space = dst_sq;
        }
        else {
            board.has_moved_ss.set_on(src_sq);
        }
        board.has_attacked_ss.set_on(my_space);
        if (board.get_attributes(this_piece).includes(PieceAttributes.flip_this_on_attack)) {
            if (board.black_ss.get(my_space) != board.white_ss.get(my_space)) {
                board.black_ss.flip(my_space);
                board.white_ss.flip(my_space);
                is_white = !is_white;
                is_black = !is_black;
            }
        }
        let spawn_col = (is_white && is_black) ? 2 : Number(is_black);
        if (board.get_attributes(this_piece).includes(PieceAttributes.promote_on_attack) && this_piece.held_piece && this_piece.held_piece >= 0
            && this_piece.held_piece < board.game_data.all_pieces.length && board.slots_left(this_piece.held_piece, spawn_col)) {
            board.clear_space(my_space);
            board.spawn_piece(my_space, this_piece.held_piece, spawn_col);
            board.has_moved_ss.set_on(my_space);
            let new_piece = board.game_data.all_pieces[this_piece.held_piece];
            promote_notation = "=" + (new_piece.notation ?? new_piece.symbol);
            //Old values of this_piece and piece_id should be used, so don't update them
        }
        if (!board.get_attributes(this_piece).includes(PieceAttributes.save_enemy)) {
            death(board, other_space, false, !board.get_attributes(this_piece).includes(PieceAttributes.dont_flip_enemy));
            is_capture = true;
        }
        else if (!board.get_attributes(this_piece).includes(PieceAttributes.dont_flip_enemy)) {
            board.black_ss.flip(other_space);
            board.white_ss.flip(other_space);
        }
        if (board.get_attributes(this_piece).includes(PieceAttributes.fireball) || board.get_attributes(other_piece).includes(PieceAttributes.bomb)) {
            death(board, my_space, false, true);
        }
        if (board.get_attributes(this_piece).includes(PieceAttributes.burn_attack)) {
            let x = evaluate_burns(board, this_id, my_space, board.turn);
            is_capture ||= x;
        }
    }
    else if (!board.white_ss.get(dst_sq) && !board.black_ss.get(dst_sq)) {
        //Lands on blank
        board.swap_spaces(src_sq, dst_sq);
        other_space = src_sq;
        my_space = dst_sq;
        if (board.get_attributes(this_piece).includes(PieceAttributes.burn_peaceful)) {
            let x = evaluate_burns(board, this_id, dst_sq, board.turn);
            is_capture ||= x;
        }
        if (board.get_attributes(this_piece).includes(PieceAttributes.flip_on_passive)) {
            //Only flip if there's a piece there
            if (board.black_ss.get(dst_sq) || board.white_ss.get(dst_sq)) {
                board.black_ss.flip(dst_sq);
                board.white_ss.flip(dst_sq);
            }
        }
    }

    //En passant
    if (board.get_attributes(this_piece).includes(PieceAttributes.ep_capturer) && board.ep_mask.get(my_space)) {
        let other_white = board.white_ss.get(board.last_moved_dest), other_black = board.black_ss.get(board.last_moved_dest);
        if ((!board.get_attributes(this_piece).includes(PieceAttributes.save_enemy) && ((board.turn && other_white) || (!board.turn && other_black)))
            || ((board.get_attributes(this_piece).includes(PieceAttributes.kill_ally) && ((board.turn && other_white) || (!board.turn && other_black))))) {
            //If it's an enemy and I can kill enemies, or it's an ally and I can kill allies
            death(board, board.last_moved_dest, false, true);
            is_capture = true;
        }
    }

    //Kill between
    let kill = new Squareset(board.game_data.width * board.game_data.height);
    if (board.get_attributes(this_piece).includes(PieceAttributes.kill_between)) {
        kill.ore(get_ep_ss(src_sq, dst_sq, board.game_data));
        if (board.get_attributes(this_piece).includes(PieceAttributes.save_enemy)) {
            kill.ande(board.turn ? board.white_ss.inverse() : board.black_ss.inverse());
        }
        if (!board.get_attributes(this_piece).includes(PieceAttributes.kill_ally)) {
            kill.ande(board.turn ? board.black_ss.inverse() : board.white_ss.inverse());
        }
        kill.ande(ss_or(board.white_ss, board.black_ss));
    }
    for (; !kill.is_zero(); kill.pop()) {
        death(board, kill.get_ls1b(), true, true);
        is_capture = true;
    }

    //Spawn_trail, then spawn_constant
    if (board.get_attributes(this_piece).includes(PieceAttributes.spawn_trail)) {
        if (!board.black_ss.get(other_space) && !board.white_ss.get(other_space) && this_piece.held_piece) {
            let spawn_col = (is_white && is_black) ? 2 : Number(is_black);
            if(board.slots_left(this_piece.held_piece, spawn_col)) {
                board.spawn_piece(other_space, this_piece.held_piece, spawn_col)
            }
        }
    }
    for (let a = board.get_attribute_ss(PieceAttributes.spawn_constant); !a.is_zero(); a.pop()) {
        //Treat as col determines the orientation of the spawning squareset
        //Spawn col determines color of the pieces it spawns
        let sq = a.get_ls1b();
        let piece = board.game_data.all_pieces[board.identify_piece(sq)];
        if (!piece.held_move || !piece.held_piece) continue;
        let treat_as_col = board.black_ss.get(sq) && (!board.white_ss.get(sq) || board.turn);
        let spawn_col = (board.white_ss.get(sq) && board.black_ss.get(sq)) ? 2 : Number(board.black_ss.get(sq));
        let spawn_ss = new Squareset(board.game_data.get_move_ss(piece.held_move, sq, treat_as_col ? 4 : 0));
        spawn_ss.ande(ss_or(board.black_ss, board.white_ss).inverse());
        let pop_count = spawn_ss.count_bits() - board.slots_left(piece.held_piece, spawn_col);
        for (let b = 0; b < pop_count; b ++) {
            spawn_ss.pop();
        }
        for (; !spawn_ss.is_zero(); spawn_ss.pop()) {
            board.spawn_piece(spawn_ss.get_ls1b(), piece.held_piece, spawn_col);
        }
    }

    //Passive burn
    let burn_white = new Squareset(board.game_data.width * board.game_data.height);
    let burn_black = new Squareset(board.game_data.width * board.game_data.height);
    for (let a = board.get_attribute_ss(PieceAttributes.burn_passive); !a.is_zero(); a.pop()) {
        //Neutral piece's burn direction is based on whose turn it is
        //But neutral pieces burn both sides
        let sq = a.get_ls1b();
        let piece = board.game_data.all_pieces[board.identify_piece(sq)];
        let treat_as_col = board.black_ss.get(sq) && (!board.white_ss.get(sq) || board.turn);
        if (!piece.held_move) continue;
        if (board.black_ss.get(sq) || board.get_attributes(piece).includes(PieceAttributes.burn_allies)) {
            burn_white.ore(board.game_data.get_move_ss(piece.held_move, sq, treat_as_col ? 4 : 0));
        }
        if (board.white_ss.get(sq) || board.get_attributes(piece).includes(PieceAttributes.burn_allies)) {
            burn_black.ore(board.game_data.get_move_ss(piece.held_move, sq, treat_as_col ? 4 : 0));
        }
    }
    let burn = ss_or(ss_and(burn_white, board.white_ss), ss_and(burn_black, board.black_ss));
    burn.ande(board.get_attribute_ss(PieceAttributes.burn_immune).inverse());
    for (; !burn.is_zero(); burn.pop()) {
        death(board, burn.get_ls1b(), true, true);
        is_capture = true;
    }

    //Promotions
    let my_promotion = -1;
    if (board.piece_ss[this_id].get(my_space)) {
        let promote_to = board.find_promotions(this_id, src_sq, my_space, board.white_ss.get(my_space), board.black_ss.get(my_space));
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
            my_promotion = promote_to[0];
            throw new Error("Piece promotion not found, promoting to first possible promotion");
        }
        if (my_promotion >= 0) {
            let spawn_col = (board.white_ss.get(my_space) && board.black_ss.get(my_space)) ? 2 : Number(board.black_ss.get(my_space));
            board.clear_space(my_space);
            board.spawn_piece(my_space, my_promotion, spawn_col);
            board.has_moved_ss.set_on(my_space);
            let new_piece = board.game_data.all_pieces[my_promotion];
            promote_notation = "=" + (new_piece.notation ?? new_piece.symbol);
            //Promote from opp hand
            if (board.get_attributes(this_piece).includes(PieceAttributes.promote_from_opp_hand)
                && board.game_data.hasHand()){
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
            notation += file(src_sq%board.game_data.width);
        }
    }
    else if (!in_same_column) {
        notation += file(src_sq%board.game_data.width);
    }
    else if (!in_same_row && this_piece.notation != "") {
        notation += rank(Math.floor(src_sq/board.game_data.width), board.game_data.height);
    }
    else {
        notation += file(src_sq % board.game_data.width) + rank(Math.floor(src_sq / board.game_data.width), board.game_data.height);
    }
    //Captures
    if (is_capture) {
        notation += "x";
    }
    //To space
    notation += file(dst_sq % board.game_data.width) + rank(Math.floor(dst_sq / board.game_data.width), board.game_data.height);
    notation += promote_notation;

    //Leave EP mask
    if (board.get_attributes(this_piece).includes(PieceAttributes.ep_captured)) {
        board.ep_mask = new Squareset(get_ep_ss(src_sq, my_space, board.game_data));
    }
    else {
        board.ep_mask.zero();
    }

    let history_record: HistoryRecord = { type: "move", x1: src_x, y1: src_y, x2: dst_x, y2: dst_y, turn: board.turn_count, notation: notation, color: board.turn, position: 0};
    if (my_promotion >= 0) { history_record.promotion = my_promotion; }
    return post_move(board, src_sq, dst_sq, history_record, this_id, my_space, is_capture, (my_promotion >= 0));
}

interface MoveHistoryRecord {
    type: "move"
    color: boolean;
    notation: string;
    promotion?: number;
    turn: number;
    position: number

    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
interface DropHistoryRecord {
    type: "drop";
    color: boolean;
    notation: string;
    promotion?: number;
    turn: number;
    position: number;

    piece: number;
    dest: number;
}
interface PassHistoryRecord {
    type: "pass";
    notation: string;
    turn: number;
    position: number;
    color: boolean;
}

export type HistoryRecord = MoveHistoryRecord | DropHistoryRecord | PassHistoryRecord;

export function _make_drop_move(board: Board, piece: number, color: boolean, dest: number, promotion?: number): HistoryRecord {
    if(!validate_drop(board, piece, color, dest)) {
        throw new Error("make_drop_move called with invalid data. You should report this in #bug-reports.");
    }
    //Promotion should always be undefined until I implement drop promotions
    if(promotion != undefined) {
        throw new Error("Drop promotions aren't implemented yet");
    }
    let my_hand = color ? board.hands.black : board.hands.white;

    board.spawn_piece(dest, promotion ?? piece, Number(color));
    board.has_moved_ss.set_on(dest);
    my_hand[piece]--;

    let piece_symbol = board.game_data.all_pieces[promotion ?? piece].notation ?? board.game_data.all_pieces[promotion ?? piece].symbol;
    let notation = piece_symbol + "'" + file(dest % board.game_data.width) + rank(Math.floor(dest / board.game_data.width), board.game_data.height);

    board.ep_mask.zero(); //Dropped pieces can't be captured EP
    let hr: HistoryRecord = { piece: piece, color: color, dest: dest, turn: board.turn_count, notation: notation, type: "drop", position: 0};
    return post_move(board, -1, dest, hr, piece, dest, false, false); //Change was_promote to true if I drop-promote (once implemented)
}

export function validate_move(board: Board, src_x: number, src_y: number, dst_x: number, dst_y: number, promotion?: number) {
    let src_sq = src_y * board.game_data.width + src_x;
    let dst_sq = dst_y * board.game_data.width + dst_x;
    
    let color = (board.black_ss.get(src_sq) && board.white_ss.get(src_sq)) ? board.turn : board.black_ss.get(src_sq);
    if (!board.can_move(color)) {
        throw new Error("Player cannot move pieces");
    }

    //If a piece of turn's color isn't on src
    if(board.turn && !board.black_ss.get(src_sq) || !board.turn && !board.white_ss.get(src_sq)) {
        throw new Error("Trying to move the wrong color");
    }
    //If the piece can't move there
    if(!board.can_move_ss[src_sq].get(dst_sq)) {
        throw new Error("Trying to move to an invalid square");
    }
    return true;
}

export function validate_drop(board: Board, piece: number, color: boolean, dest: number) {
    let my_hand = color ? board.hands.black : board.hands.white;
    if (my_hand[piece] <= 0) {
        throw new Error("Trying to drop a piece you don't have");
    }
    if (color != board.turn) {
        throw new Error("Trying to drop a piece when it isn't your turn");
    }
    if (board.white_ss.get(dest) || board.black_ss.get(dest)) {
        throw new Error("Trying to drop a piece on another piece");
    }
    let drop_zone = color ?
        board.can_drop_piece_to.black[piece]:
        board.can_drop_piece_to.white[piece];
    if(!drop_zone.get(dest)) {
        throw new Error("Trying to drop a piece outside of your drop zone");
    }
    if(board.slots_left(piece, color) <= 0) {
        throw new Error("Trying to drop a piece which is at limit");
    }
    return true;
}

function post_move(board: Board, src: number, dest: number, history_record: HistoryRecord, piece_id: number, end_space: number, wasCapture: boolean, wasPromote: boolean): HistoryRecord {
    let current_turn = board.turn;
    board.last_moved_col = board.turn;
    let pieceIsStillThere = board.piece_ss[piece_id].get(end_space) && (current_turn?board.black_ss:board.white_ss).get(end_space);
    let piece = board.game_data.all_pieces[piece_id];
    //If we have bloodlust, stay on this piece and don't increment step
    if (pieceIsStillThere && board.get_attributes(piece).includes(PieceAttributes.bloodlust) && wasCapture) {
        board.is_piece_locked = true;
        board.piece_locked_pos = end_space;
    }
    //Else if we did a multi step move, stay on this piece and increment step
    else if (pieceIsStillThere && board.multi_step_pos < piece.move.length-1) {
        board.is_piece_locked = true;
        board.piece_locked_pos = end_space;
        board.multi_step_pos ++;
    }
    //Else, increment the turn
    else {
        board.is_piece_locked = false;
        board.multi_step_pos = 0;
        board.turn_pos++;
        if (board.turn_pos >= board.game_data.turn_list.length) {
            board.turn_pos = 0;
            board.turn_count++;
        }
        board.turn = board.game_data.turn_list[board.turn_pos];
    }
    board.last_moved_src = src;
    board.last_moved_dest = dest;
    if (!board.game_data.piece_move_is_empty[piece_id]) {
        board.copycat_memory = piece_id;
    }
    //Restart the turn counter if a restart_timer piece moved, or if it was a capture or promotion
    if (piece.attributes.includes(PieceAttributes.restart_timer) || wasCapture || wasPromote)
        board.draw_move_counter = 0;
    board.refresh_moves();
    if ((current_turn && !board.checked.white.is_zero()) || (!current_turn && !board.checked.black.is_zero())) {
        history_record.notation += "+";
    }
    board.find_victory();
    board.lastWasPass = false;
    return history_record;
}

//Returns true if any pieces are captured
function evaluate_burns(board: Board, piece_id: number, sq: number, col: boolean) {
    let piece = board.game_data.all_pieces[piece_id];
    if(piece.held_move === undefined) return false;
    let burn = new Squareset(board.game_data.get_move_ss(piece.held_move, sq, col ? 4 : 0));
    burn = ss_and(burn, ss_or(board.black_ss, board.white_ss),
        board.get_attribute_ss(PieceAttributes.burn_immune).inverse());
    let has_captured = false;
    if (!board.get_attributes(piece_id).includes(PieceAttributes.burn_allies)) {
        let my_ss = col ? board.black_ss : board.white_ss;
        burn.ande(my_ss.inverse());
    }
    for (; !burn.is_zero(); burn.pop()) {
        death(board, burn.get_ls1b(), true);
        has_captured = true;
    }
    return has_captured;
}
interface Killer {
    square: number,
    isWhite: boolean,
    isBlack: boolean,
    type: number
}
function death(board: Board, sq: number, is_burn = false, flip = true, killer?: Killer) {
    let piece_id = board.identify_piece(sq);
    let piece = board.game_data.all_pieces[piece_id];
    let is_neutral = board.black_ss.get(sq) && board.white_ss.get(sq);
    let burn_col = is_neutral ? !board.turn : board.black_ss.get(sq);
    let spawn_col = is_neutral ? 2 : Number(board.black_ss.get(sq));

    if (board.get_attributes(piece).includes(PieceAttributes.dont_flip_on_death)) {
        flip = false;
    }

    if (board.get_attributes(piece).includes(PieceAttributes.transform_on_death) && piece.held_piece) {
        if(!board.get_attributes(piece).includes(PieceAttributes.save_self) || board.slots_left(piece.held_piece, spawn_col)) {
            board.clear_space(sq);
            board.spawn_piece(sq, piece.held_piece, spawn_col);
            board.has_moved_ss.set_on(sq);
        }
    }
    if (flip && !is_neutral) {
        board.black_ss.flip(sq);
        board.white_ss.flip(sq);
    }
    if (!board.get_attributes(piece).includes(PieceAttributes.save_self)) {
        if ((board.game_data.hasHand() && !is_neutral) &&
            ((!is_burn && !board.game_data.game_rules.includes(GameRules.destroy_on_capture) && !board.get_attributes(piece).includes(PieceAttributes.destroy_on_capture)) ||
            (is_burn && !board.game_data.game_rules.includes(GameRules.destroy_on_burn) && !board.get_attributes(piece).includes(PieceAttributes.destroy_on_burn)))) {
            if (board.black_ss.get(sq)) {
                board.hands.black[board.identify_piece(sq)]++;
            }
            else if (board.white_ss.get(sq)) {
                board.hands.white[board.identify_piece(sq)]++;
            }
        }
        board.clear_space(sq);
    }

    if (board.get_attributes(piece).includes(PieceAttributes.burn_death)) {
        evaluate_burns(board, piece_id, sq, burn_col);
    }
    if (board.get_attributes(piece).includes(PieceAttributes.spawn_on_death) && piece.held_move && piece.held_piece) {
        let spawns = new Squareset(board.game_data.get_move_ss(piece.held_move, sq, burn_col ? 4 : 0));
        spawns.ande(ss_or(board.black_ss, board.white_ss).inverse());
        let pop_count = spawns.count_bits() - board.slots_left(piece.held_piece, spawn_col);
        for (let b = 0; b < pop_count; b ++) {
            spawns.pop();
        }
        for (; !spawns.is_zero(); spawns.pop()) {
            board.spawn_piece(spawns.get_ls1b(), piece.held_piece, Number(spawn_col));
        }
    }
    //If I am infectious, and there is a piece with the same type and color as the killer on the killer square, infect it
    if (board.get_attributes(piece).includes(PieceAttributes.infect_curse) && killer) {
        if (!board.get_attributes(killer.type).includes(PieceAttributes.curse_immune)
            && board.identify_piece(killer.square) === killer.type
            && board.white_ss.get(killer.square) === killer.isWhite
            && board.black_ss.get(killer.square) === killer.isBlack) {
                
            if (piece.held_piece === undefined) throw new Error("Trying to infect, but infecting piece has no held piece");
            board.piece_ss[killer.type].set_off(killer.square);
            board.piece_ss[piece.held_piece].set_on(killer.square);
        }
    }

    if (board.get_attributes(piece).includes(PieceAttributes.royal)) {
        //Whoever's turn it is gets a royals_killed point
        if (board.turn) {
            board.royals_killed.black++;
        }
        else {
            board.royals_killed.white++;
        }
    }
}
