import { Draws, Events, GameRules, PieceAttributes, Wins } from "../Constants";
import { Piece } from "../Piece";
import { Squareset, ss_and, ss_or } from "../Squareset";
import { GameData } from "../game_data/GameData";
import { cyrb53 } from "../random";
import { Board } from "./Board";

//Makes copy_attrib work
export function _get_attributes(board: Board, piece: number | Piece) {
    let ret = 
        typeof(piece) === "number" ? [...board.game_data.all_pieces[piece].attributes] :
        typeof(piece) === "object" ? [...piece.attributes] : [];
    if (ret.includes(PieceAttributes.copy_attrib) && board != undefined && board.copycat_memory >= 0) {
        ret.push(...board.game_data.all_pieces[board.copycat_memory].attributes);
    }
    return ret;
}

//All these get_x_ss are for copy_attrib
export function _get_solid_ss(board: Board) {
    let ret = ss_and(ss_or(board.white_ss, board.black_ss), board.get_attribute_ss(PieceAttributes.ghost).inverse());
    if (!board.game_data.has_copy_attribute || board.copycat_memory < 0 || !board.get_attributes(board.copycat_memory).includes(PieceAttributes.ghost)) {
        return ret;
    }
    for (let a = 0; a < board.game_data.all_pieces.length; a ++) {
        if (board.get_attributes(a).includes(PieceAttributes.copy_attrib)) {
            ret.ande(board.piece_ss[a].inverse());
        }
    }
    return ret;
}

export function _get_attribute_ss(board: Board, attribute: number) {
    let ret = new Squareset(board.game_data.width*board.game_data.height);
    let look_for_copies: boolean = board.game_data.has_copy_attribute && board.copycat_memory >= 0 && board.get_attributes(board.copycat_memory).includes(attribute);
    for (let a = 0; a < board.game_data.all_pieces.length; a ++) {
        if (board.get_attributes(a).includes(attribute) ||
            (look_for_copies && board.get_attributes(a).includes(PieceAttributes.copy_attrib))) {
            ret.ore(board.piece_ss[a]);
        }
    }
    return ret;
}

//Returns all pieces that are treated as iron
//Iron, unmoved statues, passive ninjas, sanctuary pieces, iron blessing
//Does not account for bronzes or silvers
//Used only once in refresh_moves
export function _get_iron_ss(board: Board) {
    let gd = board.game_data; //Shorthand
    let ret = new Squareset(gd.width*gd.height);
    for (let a = 0; a < gd.all_pieces.length; a ++) {
        let p = gd.all_pieces[a];
        //Iron
        if (board.get_attributes(p).includes(PieceAttributes.iron)) {
            ret.ore(board.piece_ss[a]);
        }
        //Iron blessing
        if (board.get_attributes(p).includes(PieceAttributes.iron_bless) && p.held_move) {
            for (let piece_ss = new Squareset(board.piece_ss[a]); !piece_ss.is_zero(); piece_ss.pop()) {
                let sq = piece_ss.get_ls1b();
                let treat_as_col = !board.white_ss.get(sq) || (board.turn && board.black_ss.get(sq));
                let my_pieces = treat_as_col ? board.black_ss : board.white_ss;
                let opp_pieces = treat_as_col ? board.white_ss : board.black_ss;
                let hm = gd.get_move_ss(p.held_move, sq, treat_as_col ? 4 : 0);
                ret.ore(ss_and(my_pieces, hm));
                if (board.get_attributes(p).includes(PieceAttributes.bless_enemies)) {
                    ret.ore(ss_and(opp_pieces, hm));
                }
            }
        }
        //Ninja
        if (board.get_attributes(p).includes(PieceAttributes.ninja)) {
            ret.ore(ss_and(board.has_attacked_ss.inverse(), board.piece_ss[a]));
        }
        //Statue
        if (board.get_attributes(p).includes(PieceAttributes.statue)) {
            ret.ore(ss_and(board.has_moved_ss.inverse(), board.piece_ss[a]));
        }
    }
    //Sanctuary
    ret.ore(ss_and(gd.sanctuary, ss_or(board.white_ss, board.black_ss)));
    return ret;
}

export function _set_piece_space(board: Board, piece: number, col: 'w' | 'b' | 'n', pos: number, rand: any, apply_fischer: boolean = false) {
    if (pos >= board.game_data.width * board.game_data.height) {
        throw new Error("Trying to place a piece out of the board bounds. Make sure your piece setup doesn't exceed the board's width * height.")
    }
    //If this is a fischer random space, set its position randomly
    if (apply_fischer) {
        let my_fischer_zone = new Squareset(board.game_data.width * board.game_data.height);
        for (let a = 0; a < board.game_data.fischer_zones.length; a++) {
            if (board.game_data.zones[board.game_data.fischer_zones[a]].get(pos)) {
                my_fischer_zone.ore(board.game_data.zones[board.game_data.fischer_zones[a]]);
            }
        }
        my_fischer_zone.ande(ss_or(board.white_ss, board.black_ss).inverse());
        if (!my_fischer_zone.is_zero()) {
            //Find a random bit in my_fischer_zone and set pos to it
            let possible_squares: number[] = [];
            for (let a = 0; a < board.game_data.width * board.game_data.height; a++) {
                if (my_fischer_zone.get(a)) {
                    possible_squares.push(a);
                }
            }
            pos = possible_squares[Math.floor(rand() * possible_squares.length)];
        }
    }

    board.piece_ss[piece].set_on(pos);
    if (col === "w" || col === "n") {
        board.white_ss.set_on(pos);
    }
    if (col === "b" || col === "n") {
        board.black_ss.set_on(pos);
    }
    let attributes = board.get_attributes(piece);
}

//Finds how many pieces can still be placed, considering piece.limit
//Color = 0/false, 1/true, or 2 = white, black, neutral respectively
//Any other color value applies it to all pieces combined
export function _slots_left (board: Board, piece_id: number, color: number | boolean) {
    if(piece_id < 0 || piece_id >= board.game_data.all_pieces.length) {
        return 0;
    }
    let limit = board.game_data.all_pieces[piece_id].limit;
    if(limit === undefined) {
        return 1000000;
    }
    let col_ss = (color == 0) ? board.white_ss :
        (color == 1) ? board.black_ss : 
        (color == 2) ? ss_and(board.black_ss, board.white_ss) :
        ss_or(board.black_ss, board.white_ss);
    let pieces_placed = ss_and(board.piece_ss[piece_id], col_ss);
    return Math.max(limit - pieces_placed.count_bits(), 0);
}

export function _find_promotions(board: Board, piece_id: number, src_sq: number, end_sq: number, 
    is_white: boolean, is_black: boolean): number[] {

    let promote_to: number[] = [];
    let in_any_zone = false;
    for (let a = 0; a < board.game_data.all_pieces[piece_id].promotions.length; a++) {
        let prom = board.game_data.all_pieces[piece_id].promotions[a];
        let start_in_white = board.game_data.zones[prom.white].get(src_sq);
        let start_in_black = board.game_data.zones[prom.black].get(src_sq);
        let end_in_white = board.game_data.zones[prom.white].get(end_sq);
        let end_in_black = board.game_data.zones[prom.black].get(end_sq);
        if (prom.on.includes(Events.self) && src_sq === end_sq &&
            ((is_white && start_in_white) || (is_black && start_in_black))) {
                promote_to.push(...prom.to);
                in_any_zone = true;
            }
        else if (prom.on.includes(Events.enter) &&
            ((is_white && !start_in_white && end_in_white) ||
            (is_black && !start_in_black && end_in_black))) {
            promote_to.push(...prom.to);
            in_any_zone = true;
        }
        else if (prom.on.includes(Events.exit) &&
            ((is_white && start_in_white && !end_in_white) ||
            (is_black && start_in_black && !end_in_black))) {
            promote_to.push(...prom.to);
            in_any_zone = true;
        }
        else if (prom.on.includes(Events.between) &&
            ((is_white && start_in_white && end_in_white) ||
            (is_black && start_in_black && end_in_black))) {
            promote_to.push(...prom.to);
            in_any_zone = true;
        }
    }
    //If I promote to a piece in my opponent's hand, add that here
    if (in_any_zone && board.get_attributes(piece_id).includes(PieceAttributes.promote_from_opp_hand)
        && board.game_data.hasHand()) {
        let opp_hand = (!is_white && is_black) ? board.hands.white :
            (is_white && !is_black) ? board.hands.black :
            board.turn ? board.hands.white : board.hands.black;
        for (let a = 0; a < opp_hand.length; a ++) {
            if (opp_hand[a] > 0) {
                promote_to.push(a);
            }
        }
    }
    //Go through each element of promote_to to make sure it doesn't exceed the piece limit

    promote_to = [...new Set(promote_to)]
        .filter(e => is_valid_prom(piece_id, e, is_white, is_black, end_sq, board));

    return promote_to;
}


//Currently not used
//If I implement drop promotions, this will be useful
function _find_drop_promotions(board: Board, piece_id: number, end_sq: number, 
    color: boolean): number[] {

    let promote_to: number[] = [];
    for (let a = 0; a < board.game_data.all_pieces[piece_id].promotions.length; a++) {
        let prom = board.game_data.all_pieces[piece_id].promotions[a];
        let end_in_white = board.game_data.zones[prom.white].get(end_sq);
        let end_in_black = board.game_data.zones[prom.black].get(end_sq);
        if (prom.on.includes(Events.drop) &&
            ((!color && end_in_white) || (color && end_in_black))) {
            promote_to.push(...prom.to);
        }
    }
    //Promote from opp hand doesn't make sense here
    promote_to.filter(e => is_valid_prom(piece_id, e, !color, color, end_sq, board));
    return promote_to;
}

function is_valid_prom(this_piece: number, prom_piece: number, is_white: boolean, 
    is_black: boolean, sq: number, board: Board): boolean {
    if (prom_piece === this_piece) {
        return true;
    }
    let treat_as_col = (is_white && is_black) ? 2 : is_black ? 1 : 0;
    if (!board.slots_left(prom_piece, treat_as_col)) {
        return false;
    }
    let file_limit = board.game_data.all_pieces[prom_piece].file_limit;
    if (file_limit) {
        let file_col = is_white && is_black ? undefined : is_black;
        if (board.count_pieces_in_column(prom_piece, sq%board.game_data.width, file_col) >= file_limit) {
            return false;
        }
    }
    return true;
}

///color is optional - if not provided, counts all pieces
export function _count_pieces_in_column(board: Board, piece_id: number, column: number, color?: boolean): number {
    let ret = 0;
    for (let a = 0; a < board.game_data.height; a ++) {
        let sq = board.game_data.width*a + column;
        if (board.piece_ss[piece_id].get(sq) &&
            ((color === undefined) || (color && board.black_ss.get(sq)) || (!color && board.white_ss.get(sq)))) {
            ret ++;
        }
    }
    return ret;
}

export function _set_from_game_data(board: Board, gd: GameData, rand: any): void {
    //Read piece string and place pieces
    for (let a = 0, pos = 0; a < gd.setup.length; a++) {
        let char = gd.setup[a];
        if (["b", "w", "n"].includes(char.toLowerCase())) {
            let col = char.toLowerCase();
            if(col != "b" && col != "w" && col != "n") return;
            a++;
            let piece = gd.all_pieces.findIndex(piece => piece.symbol === gd.setup[a]);
            if (piece === -1) {
                continue;
            }
            board.set_piece_space(piece, col, pos, rand, true);
            pos++;
        }
        else if (char === ".") {
            pos++;
        }
        else if (char<="9" && char>="0") {
            //Find the whole number
            let num = parseInt(char);
            a++;
            while (gd.setup[a]<="9" && gd.setup[a]>="0") {
                num *= 10;
                num += parseInt(gd.setup[a]);
                a++;
            }
            //Find the next char - should be b, w, n, or .
            if (gd.setup[a] === ".") {
                pos += num;
            } else if (["b", "w", "n"].includes(gd.setup[a].toLowerCase())) {
                let col = gd.setup[a].toLowerCase();
                if(col != "b" && col != "w" && col != "n") return;
                a++;
                let piece = gd.all_pieces.findIndex(piece => piece.symbol === gd.setup[a]);
                if (piece === -1) {
                    continue;
                }
                for (let b = 0; b < num; b++) {
                    board.set_piece_space(piece, col, pos, rand, true);
                    pos++;
                }
            }
        }
    }
    //Flip or rotate the board
    if (gd.copy === "flip" || gd.copy === "rotate") {
        let placed_pieces = ss_or(board.white_ss, board.black_ss);
        for (; !placed_pieces.is_zero(); placed_pieces.pop()) {
            let sq_orig = placed_pieces.get_ls1b();
            let sq = gd.width * gd.height - sq_orig - 1;
            if (gd.copy === "flip") {
                sq = (gd.height - Math.floor(sq_orig / gd.width) - 1) * gd.width + (sq_orig % gd.width);
            }
            if (!board.black_ss.get(sq) && !board.white_ss.get(sq)) {
                let col: "w" | "b" | "n" =
                    (board.black_ss.get(sq_orig) && board.white_ss.get(sq_orig)) ? "n" :
                    board.black_ss.get(sq_orig) ? "w" : "b";
                board.set_piece_space(board.identify_piece(sq_orig), col, sq, rand);
            }
        }
    }
}

//Returns ID of piece at given square
export function _identify_piece(board: Board, sq: number) {
    for (let a = 0; a < board.game_data.all_pieces.length; a++) {
        if (board.piece_ss[a].get(sq)) {
            return a;
        }
    }
    return -1;
}

export function _spawn_piece(board: Board, sq: number, piece_id: number, col: number) {
    if (board.white_ss.get(sq) || board.black_ss.get(sq)) {
        return;
    }
    let fl = board.game_data.all_pieces[piece_id].file_limit;
    if (fl) {
        if (board.count_pieces_in_column(piece_id, sq%board.game_data.width, (col === 2) ? undefined : (col === 1)) >= fl) {
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
    let attributes = board.get_attributes(piece_id);
    board.has_moved_ss.set_off(sq);
    board.has_attacked_ss.set_off(sq);
}
export function _swap_spaces(board: Board, src: number, dest: number) {
    swap_ss_space(src, dest, board.black_ss);
    swap_ss_space(src, dest, board.white_ss);
    swap_ss_space(src, dest, board.has_attacked_ss);
    for (let a = 0; a < board.game_data.all_pieces.length; a++) {
        swap_ss_space(src, dest, board.piece_ss[a]);
    }
    board.has_moved_ss.set_on(src);
    board.has_moved_ss.set_on(dest);
}
export function _clear_space(board: Board, sq: number) {
    board.black_ss.set_off(sq);
    board.white_ss.set_off(sq);
    board.has_attacked_ss.set_off(sq);
    board.has_moved_ss.set_off(sq);
    for (let a = 0; a < board.game_data.all_pieces.length; a++) {
        board.piece_ss[a].set_off(sq);
    }
}
function swap_ss_space(src: number, dest: number, ss: Squareset) {
    let temp = ss.get(src);
    ss.set(src, ss.get(dest));
    ss.set(dest, temp);
}

export function _can_move(board: Board, color: boolean) {
    //If game_data.force_drop and you have pieces in your hand, you can't move normally
    if (board.game_data.game_rules.includes(GameRules.force_drop) && board.game_data.hasHand()) {
        if ((color && board.can_drop.black) || (!color && board.can_drop.white)) {
            return false;
        }
    }
    return true;
}
//find_victory is called after player makes a move or passes, after everything else is incremented
//It does not need to be called externally- instead you should reference the board's victory variable
export function _find_victory(board: Board): void {
    let w = board.game_data.wins, d = board.game_data.draws;
    //Royal Capture
    //If your royal gets captured, you lose
    let blackWon = "", whiteWon = "", drew = "";
    if (w.includes(Wins.royal_capture_n)) {
        if (board.royals_killed.black >= (board.game_data.royal_capture_n ?? 1))
            blackWon = "royal capture";
        if (board.royals_killed.white >= (board.game_data.royal_capture_n ?? 1))
            whiteWon = "royal capture";
    }
    //Royal Extinction
    let all_royals = board.get_attribute_ss(PieceAttributes.royal);
    if (w.includes(Wins.royal_extinction)) {
        if (ss_and(all_royals, board.white_ss).is_zero())
            blackWon = "royal extinction";
        if (ss_and(all_royals, board.black_ss).is_zero())
            whiteWon = "royal extinction";
    }
    //Endangered Extinction
    for (let a = 0; a < board.game_data.all_pieces.length; a ++) {
        let p = board.game_data.all_pieces[a];
        if (p.attributes.includes(PieceAttributes.endangered)) {
            if (ss_and(board.piece_ss[a], board.white_ss).is_zero())
                blackWon = `extinction of ${p.name}`;
            if (ss_and(board.piece_ss[a], board.black_ss).is_zero())
                whiteWon = `extinction of ${p.name}`;
        }
    }
    //Bare Royals
    //If you have no non-royal pieces, you lose
    if (w.includes(Wins.bare_royal)) {
        if (ss_and(all_royals.inverse(), board.white_ss).is_zero())
            blackWon = "bare royals";
        if (ss_and(all_royals.inverse(), board.black_ss).is_zero())
            whiteWon = "bare royals";
    }
    //Stalemate
    let has_possible_moves = { white: false, black: false };
    for (let a = 0; a < board.game_data.width * board.game_data.height; a++) {
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
    if (board.game_data.hasHand()) {
        has_possible_moves.white ||= board.can_drop.white;
        has_possible_moves.black ||= board.can_drop.black;
    }
    if (w.includes(Wins.stalemate) || d.includes(Draws.stalemate)) {
        if (!board.turn && !has_possible_moves.white) {
            if (d.includes(Draws.stalemate))
                drew = "stalemate";
            else
                blackWon = "stalemate";
        }
        if (board.turn && !has_possible_moves.black) {
            if (d.includes(Draws.stalemate))
                drew = "stalemate";
            else
                whiteWon = "stalemate";
        }
    }
    //n-check
    if (board.multi_step_pos === 0) {
        if (!board.checked.white.is_zero()) board.times_checked.black ++;
        if (!board.checked.black.is_zero()) board.times_checked.white ++;
    }
    if (w.includes(Wins.check_n)) {
        if (board.times_checked.white >= (board.game_data.n_check ?? 3))
            whiteWon = `${board.game_data.n_check}-check`;
        if (board.times_checked.black >= (board.game_data.n_check ?? 3))
            blackWon = `${board.game_data.n_check}-check`;
    }
    //campmate
    if (w.includes(Wins.campmate) && board.game_data.camp) {
        if (ss_and(all_royals, board.white_ss, board.game_data.camp.white))
            whiteWon = 'campmate';
        if (ss_and(all_royals, board.black_ss, board.game_data.camp.black))
            blackWon = 'campmate'
    }
    //repetition-n
    //only called at the start of a player's turn, not between steps
    board.open_draw = false;
    if (board.multi_step_pos === 0 && (d.includes(Draws.repetition_n) || d.includes(Draws.repetition_force_n))) {
        let code = board.generateRepetitionCode();
        board.repetition_codes.push(code);
        //Can call draw if either this or the previous state is repeated
        let count = board.repetition_codes.filter(c => c === code).length;
        if (board.repetition_codes.length >= 2)
            count = Math.max(count, board.repetition_codes.filter(c => c === board.repetition_codes[board.repetition_codes.length-2]).length);
        if (d.includes(Draws.repetition_n) && count >= (board.game_data.repetition_n ?? 3))
            board.open_draw = true;
        if (d.includes(Draws.repetition_force_n) && count >= (board.game_data.repetition_force_n ?? 5))
            drew = `${board.game_data.repetition_force_n}-repetition`;
    }
    //move-n
    if (board.multi_step_pos === 0 && (d.includes(Draws.moves_n) || d.includes(Draws.repetition_force_n))) {
        if (d.includes(Draws.moves_n) && board.draw_move_counter >= (board.game_data.move_n ?? 50))
            board.open_draw = true;
        if (d.includes(Draws.moves_force_n) && board.draw_move_counter >= (board.game_data.move_force_n ?? 75))
            drew = `${board.game_data.move_force_n}`;
        //Increases by 1 every full turn cycle
        board.draw_move_counter += 1/board.game_data.turn_list.length;
    }
    //Total extinction
    if (board.white_ss.is_zero())
        blackWon = "total extinction";
    if (board.black_ss.is_zero())
        whiteWon = "total extinction";

    if (drew) board.victory = {val: 0.5, message: `Draw by ${drew}`};
    else if (whiteWon && blackWon) {
        if (whiteWon === blackWon) board.victory = {val: 0.5, message: `Mutual win by ${whiteWon}`};
        else board.victory = {val: 0.5, message: `Mutual win by ${whiteWon} and ${blackWon}`};
    }
    else if (whiteWon) board.victory = {val: 0, message: `White won by ${whiteWon}`}
    else if (blackWon) board.victory = {val: 1, message: `Black won by ${blackWon}`}
}
//Returns whether or not it's successful
//Returns false in the following cases:
//1. You're in the middle of a piece movement and you can't stop that movement
//2. You're not in the middle of a piece movement and you're not allowed to pass due to board rule
export function _pass(board: Board): boolean {
    if (!board.canPass())
        return false;
    board.is_piece_locked = false;
    board.multi_step_pos = 0;
    board.turn_pos++;
    if (board.turn_pos >= board.game_data.turn_list.length) {
        board.turn_pos = 0;
        board.turn_count++;
    }
    board.turn = board.game_data.turn_list[board.turn_pos];
    board.refresh_moves();
    board.find_victory();
    //Consider this a continuation of find_victory
    if (board.lastWasPass)
        board.victory = {val: 0.5, message: "Draw by consecutive passing"};
    board.lastWasPass = true;
    return true;
}
export function _canPass(board: Board): boolean {
    if (board.is_piece_locked) {
        if (board.get_attributes(board.identify_piece(board.piece_locked_pos)).includes(PieceAttributes.forced_step))
            return false;
    }
    else if (!board.game_data.game_rules.includes(GameRules.can_pass))
        return false;
    if (board.victory.val != -1)
        return false;
    return true;
}

export function _generateRepetitionCode(board: Board) {
    let relevant_data = {
        turn_pos: board.turn_pos,
        white_ss: board.white_ss,
        black_ss: board.black_ss,
        piece_ss: board.piece_ss,
        has_moved_ss: board.has_moved_ss,
        has_attacked_ss: board.has_attacked_ss,
        ep_mask: board.ep_mask,
        hands: board.hands,
        copycat_memory: -1,
    }
    //copycat memory is only relevant if we have a copycat
    for (let a = 0; a < board.game_data.all_pieces.length; a ++) {
        let p = board.game_data.all_pieces[a];
        if(p.attributes.includes(PieceAttributes.copy_attrib) || p.attributes.includes(PieceAttributes.copy_move)) {
            if (!board.piece_ss[a].is_zero()) {
                relevant_data.copycat_memory = board.copycat_memory;
                break;
            }
        }
    }
    return cyrb53(JSON.stringify(relevant_data));
}