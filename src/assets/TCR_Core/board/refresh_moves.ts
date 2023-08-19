import { Board } from "./Board";
import { GameRules, PieceAttributes } from "../Constants";
import { Squareset, ss_and, ss_or } from "../Squareset";
import { angle_to } from "../utils";
import { Term } from "../game_data/from_object";

export function _refresh_moves(board: Board) {
	//Clear all bitboards
	for(let a = 0; a < board.game_data.width*board.game_data.height; a ++){
		board.can_move_ss[a].zero();
    }
    if (board.victory.val != -1) {
        return; //Nothing can move if you already won
    }
    let can_capture = {white: false, black: false};
    //Find what pieces are immobilized
    let non_attackers = ss_and(board.game_data.pacifist, ss_or(board.white_ss, board.black_ss));
    let non_movers = new Squareset(board.game_data.width * board.game_data.height);
    for (let a = 0; a < board.game_data.all_pieces.length; a ++) {
        let p = board.game_data.all_pieces[a];
        if ((board.get_attributes(p).includes(PieceAttributes.glue_curse) || board.get_attributes(p).includes(PieceAttributes.peace_curse)) && p.held_move) {
            for (let piece_ss = new Squareset(board.piece_ss[a]); !piece_ss.is_zero(); piece_ss.pop()) {
                let sq = piece_ss.get_ls1b();
                let treat_as_col = !board.white_ss.get(sq) || (board.turn && board.black_ss.get(sq));
                let my_pieces = treat_as_col ? board.black_ss : board.white_ss;
                let opp_pieces = treat_as_col ? board.white_ss : board.black_ss;
                let hm = board.game_data.get_move_ss(p.held_move, sq, treat_as_col ? 4 : 0);
                let notCurseImmune = board.get_attribute_ss(PieceAttributes.curse_immune).inverse();
                if (board.get_attributes(p).includes(PieceAttributes.glue_curse)) {
                    non_movers.ore(ss_and(opp_pieces, hm, notCurseImmune));
                    if (board.get_attributes(p).includes(PieceAttributes.curse_allies)) {
                        non_movers.ore(ss_and(my_pieces, hm, notCurseImmune));
                    }
                }
                if (board.get_attributes(p).includes(PieceAttributes.peace_curse)) {
                    non_attackers.ore(ss_and(opp_pieces, hm, notCurseImmune));
                    if (board.get_attributes(p).includes(PieceAttributes.curse_allies)) {
                        non_attackers.ore(ss_and(my_pieces, hm, notCurseImmune));
                    }
                }
            }
        }
    }
    //Find which pieces are iron
    let iron = board.get_iron_ss(); 
    //Find stoppers
    //Stoppers are all solid pieces, at the end I or-equal with mud squares
    let solid_pieces = ss_and(board.get_solid_ss(), board.game_data.ethereal.inverse());
    let curse_mud = {white: new Squareset(board.game_data.width * board.game_data.height),
                     black: new Squareset(board.game_data.width * board.game_data.height),};
    for (let a = 0; a < board.game_data.all_pieces.length; a ++) {
        let p = board.game_data.all_pieces[a];
        if (!board.get_attributes(p).includes(PieceAttributes.mud_curse) && !board.get_attributes(p).includes(PieceAttributes.ghost_curse)) {
            continue;
        }
        for (let s = new Squareset(board.piece_ss[a]); !s.is_zero(); s.pop()) {
            if (!p.held_move) continue;
            let sq = s.get_ls1b();
            let treat_as_col = board.black_ss.get(sq) && (board.turn || !board.white_ss.get(sq));
            if (board.get_attributes(p).includes(PieceAttributes.mud_curse)) {
                if (treat_as_col || board.get_attributes(p).includes(PieceAttributes.curse_allies)) {
                    curse_mud.white.ore(board.game_data.get_move_ss(p.held_move, sq, treat_as_col ? 4 : 0));
                }
                if (!treat_as_col || board.get_attributes(p).includes(PieceAttributes.curse_allies)) {
                    curse_mud.black.ore(board.game_data.get_move_ss(p.held_move, sq, treat_as_col ? 4 : 0));
                }
            }
            if (board.get_attributes(p).includes(PieceAttributes.ghost_curse)) {
                let range = board.game_data.get_move_ss(p.held_move, sq, treat_as_col ? 4 : 0);
                if (board.get_attributes(p).includes(PieceAttributes.curse_allies))
                    range.ande(treat_as_col ? board.white_ss : board.black_ss);
                range.ande(board.get_attribute_ss(PieceAttributes.curse_immune).inverse());
                solid_pieces.ande(range.inverse());
            }
        }
    }
    board.stoppers = ss_or(solid_pieces, board.game_data.mud);
    //curse_mud.white is mud that white has to tredge through
    board.stoppers_cursed = {
        white: ss_or(board.stoppers, curse_mud.white),
        black: ss_or(board.stoppers, curse_mud.black)
    }
    //Find attackers- needed for some pre/post conditions
    find_attackers(board, non_attackers);
	//Find the move board for each piece
    for (let a = 0; a < board.game_data.all_pieces.length; a ++){
        for (let b = new Squareset(board.piece_ss[a]); !b.is_zero(); b.pop()){
            let sq = b.get_ls1b();
            if (board.is_piece_locked && board.piece_locked_pos != sq) continue;
            let steps: any[][] = [];
            if(!board.game_data.all_pieces[a].attributes.includes(PieceAttributes.no_default_move))
                if (board.game_data.all_pieces[a].move[board.multi_step_pos])
                    steps.push(board.game_data.all_pieces[a].move[board.multi_step_pos]);
            if (board.get_attributes(a).includes(PieceAttributes.copy_move) && board.copycat_memory >= 0) {
                steps.push(board.game_data.all_pieces[board.copycat_memory].move[board.multi_step_pos]);
            }
            let treat_as_col = board.black_ss.get(sq) && (board.turn || !board.white_ss.get(sq));
            for (let s = 0; s < steps.length; s ++) {
                let step_add = new Squareset(board.game_data.width * board.game_data.height);
                for (let c = 0; c < steps[s].length; c++) {
                    if (steps[s][c].length === 0) {
                        continue;
                    }
                    let add = board.parse_term(steps[s][c], 0, sq, a, treat_as_col);
                    if (steps[s][c][0].type === "sub") {
                        step_add.ande(add.inverse());
                    }
                    else {
                        step_add.ore(add);
                    }
                }
                board.can_move_ss[sq].ore(step_add);
            }
            //Cannot land on enemy if non-attacker
            if (non_attackers.get(sq)) {
                board.can_move_ss[sq].ande(treat_as_col ? board.white_ss.inverse() : board.black_ss.inverse());
            }
            //Cannot land on blank if non-mover
            if (non_movers.get(sq)) {
                board.can_move_ss[sq].ande(ss_or(board.black_ss, board.white_ss));
            }
            //Cannot land on iron enemies
            board.can_move_ss[sq].ande(ss_and(iron, treat_as_col ? board.white_ss : board.black_ss).inverse());
            //Berzerk
            if (board.get_attributes(a).includes(PieceAttributes.berzerk)) {
                let treat_as_col = board.black_ss.get(sq) && (!board.white_ss.get(sq) || board.turn);
                let enemies = treat_as_col ? board.white_ss : board.black_ss;
                if (!ss_and(board.can_move_ss[sq], enemies).is_zero()) {
                    board.can_move_ss[sq].ande(enemies);
                }
            }
            //Retreat
            if (board.get_attributes(a).includes(PieceAttributes.retreat)) {
                board.can_move_ss[sq].set_on(sq);
            }
            //Can capture
            if (!ss_and(board.can_move_ss[sq], treat_as_col ? board.white_ss : board.black_ss).is_zero()) {
                treat_as_col ? can_capture.black = true : can_capture.white = true;
            }
		}
    }
    //File limit for each piece
    for (let a = 0; a < board.game_data.all_pieces.length; a ++) {
        let p = board.game_data.all_pieces[a];
        if (p.file_limit) {
            //Find which columns are maxed out
            let maxed_cols: {white: number[], black: number[], neutral: number[]}
                = {white: [], black: [], neutral: []};
            for (let b = 0; b < board.game_data.width; b ++) {
                if (board.count_pieces_in_column(a, b, false) >= p.file_limit) {
                    maxed_cols.white.push(b);
                }
                if (board.count_pieces_in_column(a, b, true) >= p.file_limit) {
                    maxed_cols.black.push(b);
                }
                if (board.count_pieces_in_column(a, b) >= p.file_limit) {
                    maxed_cols.neutral.push(b);
                }
            }
            //Don't allow movement to those maxed columns
            for (let b = new Squareset(board.piece_ss[a]); !b.is_zero(); b.pop()) {
                let sq = b.get_ls1b();
                let my_maxed_cols = 
                    board.black_ss.get(sq) && !board.white_ss.get(sq) ? maxed_cols.black :
                    !board.black_ss.get(sq) && board.white_ss.get(sq) ? maxed_cols.white :
                    maxed_cols.neutral;
                let my_col = sq % board.game_data.width;
                for (let c = 0; c < my_maxed_cols.length; c ++) {
                    if (my_maxed_cols[c] !== my_col) {
                        for (let d = 0; d < board.game_data.height; d ++) {
                            board.can_move_ss[sq].set_off(d*board.game_data.width+my_maxed_cols[c]);
                        }
                    }
                }
            }
        }
    }
    //Berzerk board rule
    if (board.game_data.game_rules.includes(GameRules.berzerk)) {
        let neutral = ss_and(board.white_ss, board.black_ss);
        let black = ss_and(board.black_ss, neutral.inverse());
        let white = ss_and(board.white_ss, neutral.inverse());
        if (can_capture.black) {
            for(; !black.is_zero(); black.pop()) {
                let sq = black.get_ls1b();
                board.can_move_ss[sq].ande(ss_and(board.white_ss, board.black_ss.inverse()));
            }
        }
        if (can_capture.white) {
            for(; !white.is_zero(); white.pop()) {
                let sq = white.get_ls1b();
                board.can_move_ss[sq].ande(ss_and(board.black_ss, board.white_ss.inverse()));
            }
        }
        if ((board.turn && can_capture.black) || (!board.turn && can_capture.white)) {
            for(; !neutral.is_zero(); neutral.pop()) {
                let sq = neutral.get_ls1b();
                let me  = board.turn ? board.black_ss : board.white_ss;
                let opp = board.turn ? board.white_ss : board.black_ss;
                board.can_move_ss[sq].ande(ss_and(opp, me.inverse()));
            }
        }
    }
    //Attributes that require attack squares to be calculated
    for (let a = 0; a < board.game_data.all_pieces.length; a ++){
        //Child
        if (board.get_attributes(a).includes(PieceAttributes.child)) {
            let all_this_piece = new Squareset(board.piece_ss[a]);
            for (; !all_this_piece.is_zero(); all_this_piece.pop()) {
                let sq = all_this_piece.get_ls1b();
                let treat_as_col = (board.turn && board.black_ss.get(sq)) || !board.white_ss.get(sq);
                board.can_move_ss[sq].ande(treat_as_col ? board.black_attack_ss : board.white_attack_ss);
            }
        }
        //Coward
        if (board.get_attributes(a).includes(PieceAttributes.coward)) {
            let all_this_piece = new Squareset(board.piece_ss[a]);
            for (; !all_this_piece.is_zero(); all_this_piece.pop()) {
                let sq = all_this_piece.get_ls1b();
                let treat_as_col = (board.turn && board.black_ss.get(sq)) || !board.white_ss.get(sq);
                board.can_move_ss[sq].ande((treat_as_col ? board.white_attack_ss : board.black_attack_ss).inverse());
            }
        }
        //Bronze
        //This feels like a dumb and slow way to handle bronze, maybe improve later
        if (board.get_attributes(a).includes(PieceAttributes.bronze)) {
            //No enemies can land on me
            let all_pieces = new Squareset(ss_or(board.white_ss, board.black_ss));
            for (; !all_pieces.is_zero(); all_pieces.pop()) {
                let sq = all_pieces.get_ls1b();
                let treat_as_col = (board.turn && board.black_ss.get(sq)) || !board.white_ss.get(sq);
                treat_as_col ?
                    board.can_move_ss[sq].ande(ss_and(board.piece_ss[a], board.white_ss, board.white_attack_ss).inverse()):
                    board.can_move_ss[sq].ande(ss_and(board.piece_ss[a], board.black_ss, board.black_attack_ss).inverse());
            }
        }
        //Silver
        //This can also be improved a lot. 
        if (board.get_attributes(a).includes(PieceAttributes.silver)) {
            let all_this_piece = new Squareset(board.piece_ss[a]);
            for (; !all_this_piece.is_zero(); all_this_piece.pop()) {
                let sq = all_this_piece.get_ls1b();
                let treat_as_col = (board.turn && board.black_ss.get(sq)) || !board.white_ss.get(sq);
                //Find how many enemies can land on me
                let enemy_count = 0;
                let enemies = new Squareset(treat_as_col ? board.white_ss : board.black_ss);
                for (; !enemies.is_zero(); enemies.pop()) {
                    let e_sq = enemies.get_ls1b();
                    if (board.can_move_ss[e_sq].get(sq)) {
                        enemy_count ++;
                        if (enemy_count >= 2) {
                            break;
                        }
                    }
                }
                //If less than 2, no enemies can land on me
                if (enemy_count < 2) {
                    enemies = new Squareset(treat_as_col ? board.white_ss : board.black_ss);
                    for (; !enemies.is_zero(); enemies.pop()) {
                        let e_sq = enemies.get_ls1b();
                        board.can_move_ss[e_sq].set_off(sq);
                    }
                }
            }
        }
    }
    //Find checked pieces
    board.checked.white.zero();
    board.checked.black.zero();
    for (let wp = new Squareset(board.white_ss); !wp.is_zero(); wp.pop()) {
        let sq = wp.get_ls1b();
        board.checked.black.ore(ss_and(board.can_move_ss[sq], board.black_ss, board.get_attribute_ss(PieceAttributes.royal)));
    }
    for (let bp = new Squareset(board.black_ss); !bp.is_zero(); bp.pop()) {
        let sq = bp.get_ls1b();
        board.checked.white.ore(ss_and(board.can_move_ss[sq], board.white_ss, board.get_attribute_ss(PieceAttributes.royal)));
    }
    board.reload_can_drop_piece_to();
}
//Currently attackers doesn't consider iron - should this change?
//Only used within this file, no need to export
function find_attackers(board: Board, non_attackers: Squareset) {
	//Clear all attackers
	board.white_attack_ss.zero();
    board.black_attack_ss.zero();
	//Find the attack spaces for each piece
    for (let a = 0; a < board.game_data.all_pieces.length; a ++){
        //Skip if we're peaceful
        if (board.get_attributes(a).includes(PieceAttributes.peaceful)) {
            continue;
        }
        for (let b = new Squareset(board.piece_ss[a]); !b.is_zero(); b.pop()){
            let sq = b.get_ls1b();
            //Don't add attack if we're on a non-attack space
            if (non_attackers.get(sq))
                continue;
            let my_attack = new Squareset(board.game_data.width * board.game_data.height);
            let steps = [];
            if (board.game_data.all_pieces[a].move[0])
                steps.push(board.game_data.all_pieces[a].move[0]);
            if (board.get_attributes(a).includes(PieceAttributes.copy_move) && board.copycat_memory >= 0)
                steps.push(board.game_data.all_pieces[board.copycat_memory].move[0]);
            let treat_as_col = board.black_ss.get(sq) && (board.turn || !board.white_ss.get(sq));
            for (let s = 0; s < steps.length; s ++) {
                let step_add = new Squareset(board.game_data.width * board.game_data.height);
                for (let c = 0; c < steps[s].length; c++) {
                    if (steps[s][c].length === 0) {
                        continue;
                    }
                    let add = board.parse_term(steps[s][c], 0, sq, a, treat_as_col);
                    if (steps[s][c][0].type === "sub") {
                        step_add.ande(add.inverse());
                    }
                    else {
                        step_add.ore(add);
                    }
                }
                my_attack.ore(step_add);
            }
            //Add to the ss
            treat_as_col ?
                board.black_attack_ss.ore(my_attack):
                board.white_attack_ss.ore(my_attack);
            //Cannot attack sanctuaries
            board.black_attack_ss.ande(board.game_data.sanctuary.inverse());
            board.white_attack_ss.ande(board.game_data.sanctuary.inverse());
		}
    }
}
export function _parse_term(board: Board, term: Term[], term_index: number, sq: number, piece: number, col: boolean, angle?: number, is_attack = false) {
    if (angle === undefined) {
        angle = col ? 4 : 0;
    }
    let first = true
    let ret = new Squareset(board.game_data.width * board.game_data.height);
    let saved_ss = new Squareset(board.game_data.width * board.game_data.height);
    //Read the term token by token
    for (let a = term_index; a < term.length; a++) {
        if (term[a].type === "pre") {
            //Check condition, possibly return
            if (typeof (term[a].data) === "function" && (!is_attack || !term[a].at) && term[a].data(board, col, sq, piece)) {
                return ss_or(ret, saved_ss);
            }
        } else if (term[a].type === "post") {
            //Filter squares in ret
            if (typeof (term[a].data) === "function") {
                if (!is_attack || term[a].at === undefined) {
                    let req_ss = term[a].data(board, col, sq, ret);
                    ret.ande(req_ss.inverse());
                }
                else if(term.findIndex((e, i) => e.type === "mol" && i > a) === -1) {
                    if (term[a].at) {
                        ret.zero();
                    }
                }
                else if(!term[a].at) {
                    let req_ss = term[a].data(board, col, sq, ret);
                    ret.ande(req_ss.inverse());
                }
            }

        } else if (term[a].type === "mol") {
            //If it's the first molecule, add the ss
            if (first) {
                ret.ore(board.game_data.get_move_ss(term[a].data, sq, angle));
                first = false;
            }
            //Otherwise, call the function recursively for each square
            else {
                let resulting_spaces = new Squareset(board.game_data.width * board.game_data.height);
                for (let b = new Squareset(ret); !b.is_zero(); b.pop()) {
                    let new_sq = b.get_ls1b();
                    let cx = sq % board.game_data.width, cy = Math.floor(sq / board.game_data.width); //current x and y
                    let nx = new_sq % board.game_data.width, ny = Math.floor(new_sq / board.game_data.width); //new x and y
                    let new_ss = board.parse_term(term, a, new_sq, piece, col, angle_to(nx - cx, ny - cy), is_attack);
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
export function _reload_can_drop_piece_to(board: Board) {
    board.can_drop_piece_to = {white: [], black: []};
    board.can_drop = {white: false, black: false};
    for (let a = 0; a < board.game_data.all_pieces.length; a ++) {
        board.can_drop_piece_to.white.push(new Squareset(board.game_data.width * board.game_data.height, 1));
        board.can_drop_piece_to.black.push(new Squareset(board.game_data.width * board.game_data.height, 1));
        //File limit
        let fl = board.game_data.all_pieces[a].file_limit;
        if (fl) {
            for (let b = 0; b < board.game_data.width; b ++) {
                //Count how many pieces of this type and color are in the column
                let in_col = {white: 0, black: 0};
                for (let c = 0; c < board.game_data.height; c ++) {
                    let sq = b + c * board.game_data.width;
                    if (board.piece_ss[a].get(sq)) {
                        board.white_ss.get(sq) && in_col.white ++;
                        board.black_ss.get(sq) && in_col.black ++;
                    }
                }
                if (in_col.white >= fl) {
                    for(let c = 0; c < board.game_data.height; c ++) {
                        board.can_drop_piece_to.white[a].set_off(b + c * board.game_data.width);
                    }
                }
                if (in_col.black >= fl) {
                    for(let c = 0; c < board.game_data.height; c ++) {
                        board.can_drop_piece_to.black[a].set_off(b + c * board.game_data.width);
                    }
                }
            }
        }
        //Zone limit
        board.can_drop_piece_to.white[a].ande(board.game_data.get_drop_zone(a, false));
        board.can_drop_piece_to.black[a].ande(board.game_data.get_drop_zone(a, true));
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