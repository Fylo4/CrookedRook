import { Wins, Draws, Events, GameRules, PieceAttributes, attrib_str, wins_str, events_str, game_rules_str } from "../Constants";
import { Piece, Promotion } from "../Piece";
import { Squareset, ss_and, ss_or } from "../Squareset";
import { get_bnb_ss } from "../bnb_ep_init";
import { Board } from "../board/Board";
import { NameSymbol, array_singles, get_1_num, get_2_zones, get_zone_and_push, name_to_piece_id, pieces_in_bracket, string_to_mol_num, to_magic_numbers, zone_to_squareset } from "../utils";
import { GameData } from "./GameData";
import { _generate_move_ss } from "./game_data_funcs";

export function _from_object(gd: GameData, input: any): void {
    //Define the zones that need to be defined
    gd.width = input.width ?? input.x;
    gd.height = input.height ?? input.y;
    if(gd.width === undefined) throw new Error("Board must have a width");
    if(gd.height === undefined) throw new Error("Board must have a height");
    let size = gd.width*gd.height;
    
    //Zoneify zones
    let addZones = input.zones ?? input.z ?? [];
    gd.zones = [];
    for (let a = 0; a < addZones.length; a ++) {
        gd.zones.push(zone_to_squareset(addZones[a], gd.zones, gd.width, gd.height));
    }
    let fzones = input.fischer_zones ?? input.fz ?? [];
    gd.fischer_zones = [];
    for (let a = 0; a < fzones.length; a ++) {
        gd.fischer_zones.push(get_zone_and_push(fzones[a], gd.zones, gd.width, gd.height));
    }
    let t_drop_to_zone = input.drop_to_zone ?? input.dz ?? undefined;
    if (t_drop_to_zone != undefined && t_drop_to_zone.white != undefined && t_drop_to_zone.black != undefined) {
        gd.drop_to_zone= {white: get_zone_and_push(t_drop_to_zone.white, gd.zones, gd.width, gd.height),
                            black: get_zone_and_push(t_drop_to_zone.black, gd.zones, gd.width, gd.height)};
    }

    gd.active_squares = zone_to_squareset(input.active_squares ?? input.as ?? new Squareset(size, 1), gd.zones, gd.width, gd.height);
    gd.mud = zone_to_squareset(input.mud ?? input.ms ?? new Squareset(size), gd.zones, gd.width, gd.height);
    gd.ethereal = zone_to_squareset(input.ethereal ?? input.es ?? new Squareset(size), gd.zones, gd.width, gd.height);
    gd.pacifist = zone_to_squareset(input.pacifist ?? input.ps ?? new Squareset(size), gd.zones, gd.width, gd.height);
    gd.sanctuary = zone_to_squareset(input.sanctuary ?? input.ss ?? new Squareset(size), gd.zones, gd.width, gd.height);
    gd.highlight = zone_to_squareset(input.highlight ?? input.h ?? new Squareset(size), gd.zones, gd.width, gd.height);
    gd.highlight2 = zone_to_squareset(input.highlight2 ?? input.h2 ?? new Squareset(size), gd.zones, gd.width, gd.height);

    //Copy values
    gd.name = input.name ?? input.n;
    gd.code = input.code ?? gd.name.toLowerCase(); //Did this have an abbreviation that I'm forgetting?
    gd.author = input.author ?? input.a ?? ""
    gd.description = input.description ?? input.i ?? "";
    gd.turn_list = inflate_turn_list(input.turn_list ?? input.t ?? [false, true]);
    gd.castle_length = input.castle_length ?? input.c ?? 2;
    gd.starting_hands = input.starting_hands ?? input.sh ?? {white: [], black: []};
    gd.copy = input.copy ?? input.cp ?? "";
    gd.setup = input.setup ?? input.s;
    gd.game_rules = to_magic_numbers(array_singles(input.rules ?? input.r) ?? [], game_rules_str, "Game rule");
    gd.style = input.style ?? input.st ?? "checkered";
    gd.snap_mode = input.snap_mode ?? input.sm ?? "clockwise";
    gd.has_copy_attribute = false;
    gd.all_pieces = [];
    gd.move_ss = [];
    gd.seed = 0;

    //Rehydrate compressed variables
    if (input.copy === "f") { input.copy = "flip"; }
    if (input.copy === "r") { input.copy = "rotate"; }

    //Rehydrate pieces
    //First we must find some info on the pieces so they can determine what to promote to
    let piece_list = input.all_pieces ?? input.pieces ?? input.p ?? [];
    let piece_attribs = piece_list.map((piece: any) => piece.attributes ?? piece.a ?? []);
    let names_symbols_royals: NameSymbolRoyal[] = piece_list.map((piece: any, index: number) => {return {
        name: piece.name ?? piece.n ?? "",
        symbol: piece.symbol ?? piece.s ?? "",
        is_royal: piece_attribs[index].includes(PieceAttributes.royal) || piece_attribs[index].includes("royal")
    }});
    let all_molecules: string[] = [];
    for(let a = 0; a < piece_list.length; a ++) {
        gd.all_pieces.push(inflate_piece(piece_list[a], gd.zones, all_molecules, gd.width, gd.height, names_symbols_royals))
    }
    gd.piece_move_is_empty = gd.all_pieces.map(e => e.move_str === "");

    //Rehydrate starting hands
    let hands = input.starting_hands ?? input.sh;
    if (hands) gd.starting_hands = inflate_hands(hands, names_symbols_royals);
    
    //See if we have any copy_attribs
    for (let a = 0; a < gd.all_pieces.length; a ++) {
        if (gd.all_pieces[a].attributes.includes(PieceAttributes.copy_attrib)) {
            gd.has_copy_attribute = true;
            break;
        }
    }

    //Convert old-style game rule attributes to the new array
    if(input.has_hand || input.hh) gd.game_rules.push(GameRules.has_hand);
    if(input.flip_colors || input.fc) gd.game_rules.push(GameRules.flip_colors);
    if(input.force_drop || input.fd) gd.game_rules.push(GameRules.force_drop);
    if(input.destroy_on_burn || input.db) gd.game_rules.push(GameRules.destroy_on_burn);
    if(input.destroy_on_capture || input.dc) gd.game_rules.push(GameRules.destroy_on_capture);
    if(input.berzerk || input.b) gd.game_rules.push(GameRules.berzerk);
    gd.game_rules = [...new Set(gd.game_rules)];
    
    //Endgame rules
    let wins = array_singles(input.wins ?? input.w) ?? ["royal_capture"];
    for (let a = 0; a < wins.length; a ++) {
        if (typeof(wins[a]) === "number")
            continue;
        if (!isNaN(wins[a])) {
            wins[a] = Number(wins[a]);
            continue;
        }
        if (typeof(wins[a]) != "string")
            throw new Error ("Win condition not recognized: "+wins[a]);
        let winsa: string = wins[a]; //The compiler doesn't know that wins[a] is a string
        let index = wins_str.findIndex(e => e === wins[a]);
        if (index >= 0) {
            wins[a] = index;
            continue;
        }
        if (wins[a] === "royal_capture") {
            wins[a] = Wins.royal_capture_n;
            gd.royal_capture_n = 1;
            continue;
        }
        else if (winsa.startsWith("royal_capture_")) {
            let n = winsa.split("_");
            if (isNaN(Number(n[2]))) throw new Error("Win condition not recognized: "+wins[a]);
            wins[a] = Wins.royal_capture_n;
            gd.royal_capture_n = Number(n[2]);
        }
        else if (winsa.startsWith("check_")) {
            let n = winsa.split("_");
            if (isNaN(Number(n[1]))) throw new Error("Win condition not recognized: "+wins[a]);
            wins[a] = Wins.check_n;
            gd.n_check = Number(n[1]);
        }
        else {
            throw new Error("Win condition not recognized: "+wins[a]);
        }
    }
    gd.wins = wins;
    let draws = array_singles(input.draws ?? input.d) ?? [Draws.stalemate];
    for (let a = 0; a < draws.length; a ++) {
        if (typeof(draws[a]) === "number")
            continue;
        if (typeof(draws[a]) != "string")
            throw new Error ("Draw condition not recognized: "+draws[a]);
        if (!isNaN(draws[a])) draws[a] = Number(draws[a]);
        else if (draws[a] === "stalemate") draws[a] = Draws.stalemate;
        else if (draws[a] === "mutual_pass") draws[a] = Draws.mutual_pass;
        else if (draws[a].startsWith("repetition_force_")) {
            let n = draws[a].split("_");
            if (isNaN(n[2])) throw new Error("Draw condition not recognized: "+draws[a]);
            draws[a] = Draws.repetition_force_n;
            gd.repetition_force_n = Number(n[2]);
        }
        else if (draws[a].startsWith("repetition_")) {
            let n = draws[a].split("_");
            if (isNaN(n[1])) throw new Error("Draw condition not recognized: "+draws[a]);
            draws[a] = Draws.repetition_n;
            gd.repetition_n = Number(n[1]);
        }
        else if (draws[a].startsWith("moves_force_")) {
            let n = draws[a].split("_");
            if (isNaN(n[2])) throw new Error("Draw condition not recognized: "+draws[a]);
            draws[a] = Draws.moves_force_n;
            gd.move_force_n = Number(n[2]);
        }
        else if (draws[a].startsWith("moves_")) {
            let n = draws[a].split("_");
            if (isNaN(n[1])) throw new Error("Draw condition not recognized: "+draws[a]);
            draws[a] = Draws.moves_n;
            gd.move_n = Number(n[1]);
        }
    }
    gd.draws = draws;
    //If stalemate = win, then stalemate is a win and not draw
    if (gd.wins.includes(Wins.stalemate) && gd.draws.includes(Draws.stalemate)) {
        gd.draws.splice(gd.draws.indexOf(Draws.stalemate), 1);
    }
    //Make sure all neccesary win variables are defined
    if (gd.wins.includes(Wins.royal_capture_n) && !gd.royal_capture_n)
        gd.royal_capture_n = 1;
    if (gd.wins.includes(Wins.check_n) && !gd.n_check)
        gd.n_check = 3;
    if (gd.wins.includes(Wins.campmate)) {
        gd.camp = {
            white: gd.zones[get_zone_and_push(input.camp?.white ?? "black_rank_1", gd.zones, gd.width, gd.height)],
            black: gd.zones[get_zone_and_push(input.camp?.black ?? "white_rank_1", gd.zones, gd.width, gd.height)],
        };
    }
    if (gd.draws.includes(Draws.moves_n) && !gd.move_n)
        gd.move_n = 50;
    if (gd.draws.includes(Draws.moves_force_n) && !gd.move_force_n)
        gd.move_force_n = 75;
    if (gd.draws.includes(Draws.repetition_n) && !gd.repetition_n)
        gd.repetition_n = 3;
    if (gd.draws.includes(Draws.repetition_force_n) && !gd.repetition_force_n)
        gd.repetition_force_n = 5;
    //Set nextTurnWin
    let nextTurnWin = array_singles(input.next_turn_wins) ?? [];
    for (let a = 0; a < nextTurnWin.length; a ++) {
        if (typeof(nextTurnWin[a]) === "number")
            continue;
        if (!isNaN(Number(nextTurnWin[a]))) {
            nextTurnWin[a] = Number(nextTurnWin[a]);
            continue;
        }
        if (typeof(nextTurnWin [a]) != "string")
            throw new Error("Unknown next_turn_wins value: "+nextTurnWin[a]);

        let index = wins_str.findIndex(w => w === nextTurnWin[a]);
        if (index >= 0)
            nextTurnWin[a] = index;
        else if (nextTurnWin[a].startsWith('check'))
            nextTurnWin[a] = Wins.check_n;
        else if (nextTurnWin[a].startsWith('royal_capture'))
            nextTurnWin[a] = Wins.royal_capture_n;
        else
            throw new Error("Unknown next_turn_wins value: "+nextTurnWin[a]);
    }
    gd.nextTurnWins = nextTurnWin;

    //Set move_ss
    for (let a = 0; a < all_molecules.length; a ++) {
        gd.move_ss.push(_generate_move_ss(gd, all_molecules[a]));
    }

    //See if there were any random variables in the setup
    gd.has_random = false;
    if (gd.fischer_zones.length)
        gd.has_random = true;
    if (gd.all_pieces.filter(p => p.attributes.includes(PieceAttributes.random_promotion)).length)
        gd.has_random = true;

    validate_game_data(gd);
}

interface NameSymbolRoyal {
    name: string,
    symbol: string,
    is_royal: boolean
};

function inflate_turn_list(turn_list: any[]): boolean[] {
    let ret: boolean[] = []
    for (let a = 0; a < turn_list.length; a ++) {
        if (typeof(turn_list[a]) === "string") {
            let word = turn_list[a].toLowerCase()
            if (word === "w" || word === "white") {
                ret.push(false);
            }
            if (word === "b" || word === "black") {
                ret.push(true);
            }
        }
        else {
            ret.push(!!turn_list[a]);
        }
    }
    return ret;
}
function inflate_hands(hands: any, pieces: NameSymbol[]): { white: number[], black: number[] } {
    let ret: { white: number[], black: number[] } = {white: [], black: []};
    //Name-based hand filling
    //Should have one string for each individual piece the player starts with, either symbol or name
    if ((hands.white && Array.isArray(hands.white) && typeof(hands.white[0]) === "string") || 
        (hands.black && Array.isArray(hands.black) && typeof(hands.black[0]) === "string")) {
        for (let a = 0; a < pieces.length; a++) {
            ret.white.push(0);
            ret.black.push(0);
        }
        for (let a = 0; a < hands.white.length; a++) {
            let id = name_to_piece_id(hands.white[a], pieces);
            if (id >= 0) {
                ret.white[id]++;
            }
        }
        for (let a = 0; a < hands.black.length; a++) {
            let id = name_to_piece_id(hands.black[a], pieces);
            if (id >= 0) {
                ret.black[id]++;
            }
        }
        return ret;
    }
    //Number-based filling
    //Should have one number for each piece type, indicating how much of that piece white/black starts with
    if ((hands.white && Array.isArray(hands.white) && typeof(hands.white[0]) === "number") || 
        (hands.black && Array.isArray(hands.black) && typeof(hands.black[0]) === "number")) {
        for(let a = 0; a < hands.white.length; a ++) {
            if (typeof(hands.white[a]) === 'number') 
                ret.white.push(hands.white[a]);
            if (ret.white.length >= pieces.length) 
                break;
        }
        for(let a = 0; a < hands.black.length; a ++) {
            if (typeof(hands.black[a]) === 'number') 
                ret.black.push(hands.black[a]);
            if (ret.black.length >= pieces.length) 
                break;
        }
    }
    //Make sure all pieces have a hand index
    for (let a = ret.white.length; a < pieces.length; a++)
        ret.white.push(0);
    for (let a = ret.black.length; a < pieces.length; a++)
        ret.black.push(0);
    return ret;
}

//Pieces should include all piece names, symbols, and is_royal
function promote_to_number(name: string, pt_string: string[], pieces: NameSymbolRoyal[]): number[] {
    let new_to: number[] = [];
    for (let a = 0; a < pt_string.length; a++) {
        if (pt_string[a] === "NSNR" || pt_string[a] === "NRNS") { //Non-self non-royal
            for (let c = 0; c < pieces.length; c++) {
                if (pieces[c].name != name && !pieces[c].is_royal) {
                    new_to.push(c);
                }
            }
            continue;
        }
        else {
            let id = name_to_piece_id(pt_string[a], pieces);
            if (id >= 0) {
                new_to.push(id);
            }
        }
    }
    return new_to;
}

function inflate_piece(piece: any, all_zones: Squareset[], all_molecules: string[], width: number, height: number, names_symbols_royals: NameSymbolRoyal[]): Piece {
    let drop_to_zone: {white: number, black: number} | undefined = undefined;
    if(piece.drop_to_zone ?? piece.z) {
        drop_to_zone = {
            white: get_zone_and_push(piece.drop_to_zone?.white ?? piece.z?.white, all_zones, width, height),
            black: get_zone_and_push(piece.drop_to_zone?.black ?? piece.z?.black, all_zones, width, height),
        }
    }

    //Process promotions (promote to is processed more later)
    let promotions: Promotion[] = [];
    let prom_to_add = array_singles(piece.promotions ?? piece.p) ?? [];
    for(let a = 0; a < prom_to_add.length; a ++) {
        let on: number[] = to_magic_numbers(array_singles(prom_to_add[a].on ?? prom_to_add[a].o) ?? [Events.enter], events_str, "Piece promotion event");
        let to_str: string[] = array_singles(prom_to_add[a].to ?? prom_to_add[a].t) ?? [];
        promotions.push({
            white: get_zone_and_push(prom_to_add[a].white ?? prom_to_add[a].w ?? "black_rank_1", all_zones, width, height),
            black: get_zone_and_push(prom_to_add[a].black ?? prom_to_add[a].b ?? "white_rank_1", all_zones, width, height),
            on,
            to: promote_to_number(piece.name ?? piece.n, to_str, names_symbols_royals)
        })
        if(promotions[a].to.length === 0) {
            throw new Error(`You must specify what ${piece.name ?? piece.n} promotes to`);
        }
    }

    let hm = piece.held_move ?? piece.hm ?? undefined;
    if(typeof(hm) === 'string') {
        hm = string_to_mol_num(hm, all_molecules);
    }
    let move_str = piece.move ?? piece.m ?? "";
    let ret = new Piece({
        name: piece.name ?? piece.n,
        description: piece.description ?? piece.d ?? "",
        sprite: piece.sprite ?? piece.i,
        mini_sprite: piece.mini_sprite ?? undefined,
        angle: piece.angle ?? piece.r ?? undefined,
        symbol: piece.symbol ?? piece.s,
        notation: piece.notation ?? piece.w ?? undefined,
        move_str,
        move: string_to_move(move_str, all_molecules, names_symbols_royals, all_zones, width, height),
        attributes: to_magic_numbers(array_singles(piece.attributes ?? piece.a) ?? [], attrib_str, "Piece attribute"),
        promotions,
        drop_to_zone,
        limit: piece.limit ?? piece.l ?? undefined,
        file_limit: piece.file_limit ?? piece.f ?? undefined,
        held_piece: name_to_piece_id(piece.held_piece ?? piece.hp, names_symbols_royals),
        held_move: hm,
        flip_sprite: piece.flip_sprite ?? piece.fs ?? false
    });
    if (ret.sprite === "cerebus") { ret.sprite = "cerberus"; }
    if (ret.held_move === undefined) {
        let attributes_that_require_hm = [
            PieceAttributes.glue_curse, PieceAttributes.peace_curse, PieceAttributes.ghost_curse, PieceAttributes.mud_curse, PieceAttributes.infect_curse,
            PieceAttributes.burn_peaceful, PieceAttributes.burn_passive, PieceAttributes.burn_attack, PieceAttributes.burn_death,
            PieceAttributes.iron_bless,
            PieceAttributes.spawn_constant, PieceAttributes.spawn_on_death, PieceAttributes.spawn_trail,
        ];
        for (let b = 0; b < attributes_that_require_hm.length; b++) {
            if (ret.attributes.includes(attributes_that_require_hm[b])) {
                ret.held_move = string_to_mol_num("[K]", all_molecules);
                break;
            }
        }
    }

    return ret;
}

function validate_game_data(game_data: GameData): void {
    if (game_data.snap_mode && !["clockwise", "counterclockwise", "orthogonal", "diagonal"].includes(game_data.snap_mode)) {
        throw new Error("Snap mode not found: "+game_data.snap_mode);
    }
    if (game_data.copy && !["", "flip", "rotate"].includes(game_data.copy)) {
        throw new Error("Copy type not found: "+game_data.copy);
    }
    for (let a = 0; a < game_data.all_pieces.length; a ++) {
        let p = game_data.all_pieces[a];
        //There is no expected default behavior for held pieces. They must always be defined.
        if (p.held_piece === undefined) {
            if (p.attributes.includes(PieceAttributes.spawn_constant) || 
                p.attributes.includes(PieceAttributes.spawn_on_death) ||
                p.attributes.includes(PieceAttributes.spawn_trail)) {
                throw new Error(`Piece ${p.name} has a spawn attribute but no held piece`);
            }
            if (p.attributes.includes(PieceAttributes.transform_on_death)) {
                throw new Error(`Piece ${p.name} has transform on death attribute but no held piece`);
            }
        }
    }
}

//Process the entire move string
function string_to_move(string: string, mols: string[], pieceList: NameSymbol[], all_zones: Squareset[], width: number, height: number) {
    let steps = string.split(">");
    let move: Term[][][] = [];
    for (let a = 0; a < steps.length; a++) {
        move.push([]);
        let terms = steps[a].split("+");
        for (let b = 0; b < terms.length; b++) {
            let this_term = string_to_term(terms[b], mols, pieceList, all_zones, width, height);
            move[a].push(this_term);
        }
    }
    return move;
}

export interface Term {
    type: string,
    data?: any,
    at?: boolean,
}

//Process a single component of the move string
function string_to_term(string: string, mols: string[], pieceList: NameSymbol[], all_zones: Squareset[], width: number, height: number): Term[] {
    //Updates mols and returns term array
    let term: Term[] = [];
    let repeat = -1; //Position in the term array where it loops to; -1 for no loop
    for (let a = 0; a < string.length; a++) {
        //Find molecules
        if (string[a] === "(" || string[a] === "[") {
            let end_char = (string[a] === "(") ? ")" : "]";
            let t_mol = "";
            while (a < string.length && string[a] != end_char) {
                t_mol += string[a];
                a++;
            }
            t_mol += end_char;
            if (!mols.includes(t_mol)) {
                mols.push(t_mol);
            }
            let data = mols.findIndex(e => e === t_mol);
            term.push({ type: "mol", data });
        }
        else if (string[a] === "U") {
            if (!mols.includes("U")) {
                mols.push("U");
            }
            let data = /*game_data.precompute ? mols.findIndex(e => e === "U") :*/ "U";
            term.push({ type: "mol", data });
        }
        //Pre-conditions
        //Data is break condition
        else if (string[a] === "T") {
            let num = get_1_num(string, a + 1);
            term.push({ type: "pre", data: (board: Board) => { return (board.turn_count <= num.num); } });
            a = num.pos;
        }
        else if (string[a] === "t") {
            let num = get_1_num(string, a + 1);
            term.push({ type: "pre", data: (board: Board) => { return (board.turn_count >= num.num); } });
            a = num.pos;
        }
        else if (string[a] === "i") { term.push({ type: "pre",
            data: (board: Board, col: boolean, pos: number) => { return board.has_moved_ss.get(pos); } }); }
        else if (string[a] === "z") {
            let nums = get_2_zones(string, a + 1, all_zones, width, height);
            term.push({type: "pre", data: (board: Board, col: boolean, pos: number) => { return !board.game_data.zones[col ? nums.num2 : nums.num1].get(pos); } });
            a = nums.pos;
        }
        else if (string[a] === "r") {
            let piece_data = pieces_in_bracket(string, a + 1, pieceList);
            term.push({ type: "pre", data: (board: Board, col: boolean) => {
                for(let a = 0; a < piece_data.pieces.length; a ++) {
                    if(!board.slots_left(piece_data.pieces[a], col)) {
                        return true;
                    }
                }
                return false;
            }});
            a = piece_data.pos;
        }
        else if(string[a] === "u") {
            term.push({ type: "pre", data: (board: Board, col: boolean, pos: number, id: number) => {
                return ss_and(col ? board.black_ss : board.white_ss, board.piece_ss[id]).count_bits() > 1;
            }})
        }
        else if(string[a] === "h") {
            term.push({ type: "pre", data: (board: Board, col: boolean) => {
                if (!board.game_data.hasHand()) {
                    return true;
                }
                let opp_hand = col ? board.hands.white : board.hands.black;
                for (let a = 0; a < opp_hand.length; a ++) {
                    if(opp_hand[a] > 0) { return false; }
                }
                return true;
            }})
        }
        else if (string[a] === "k") { term.push({ type: "pre",
            data: (board: Board, col: boolean, pos: number) => { return board.has_attacked_ss.get(pos); } }); }
        else if (string[a] === "K") { term.push({ type: "pre",
            data: (board: Board, col: boolean, pos: number) => { return !board.has_attacked_ss.get(pos); } }); }
        else if (string[a] === "d") {
            term.push({ type: "pre", at: true, data: (board: Board, col: boolean, pos: number) => {
                return col ? board.black_attack_ss.get(pos) : board.white_attack_ss.get(pos);
            } });
        }
        else if (string[a] === "D") {
            term.push({ type: "pre", at: true, data: (board: Board, col: boolean, pos: number) => {
                return col ? !board.black_attack_ss.get(pos) : !board.white_attack_ss.get(pos);
            } });
        }
        else if (string[a] === "x") {
            term.push({ type: "pre", at: true, data: (board: Board, col: boolean, pos: number) => {
                return col ? board.white_attack_ss.get(pos) : board.black_attack_ss.get(pos);
            } });
        }
        else if (string[a] === "X") {
            term.push({ type: "pre", at: true, data: (board: Board, col: boolean, pos: number) => {
                return col ? !board.white_attack_ss.get(pos) : !board.black_attack_ss.get(pos);
            } });
        }
        //Post-conditions
        //Data is a lambda that returns all squares it can't land on
        //at is how it applies to finding attacking squares
        //at=true: remove all spaces; at=false: skip, at=undefined: normal
        else if (string[a] === "a") { term.push({ type: "post", at: false,
            data: (board: Board, col: boolean) => {
                return col ? ss_and(board.black_ss, board.white_ss.inverse()) :
                ss_and(board.white_ss, board.black_ss.inverse())
            } }); }
        else if (string[a] === "e") { term.push({ type: "post", at: true,
            data: (board: Board, col: boolean) => { return col ? board.white_ss : board.black_ss } }); }
        else if (string[a] === "b") { term.push({ type: "post", at: false,
            data: (board: Board) => { return ss_or(board.white_ss, board.black_ss).inverse() } }); }
        else if (string[a] === "c") { term.push({ type: "post", at: false,
            data: (board: Board, col: boolean) => {
                return board.last_moved_col === col ? ss_or(board.white_ss, board.black_ss).inverse() :
                    ss_and(ss_or(board.white_ss, board.black_ss).inverse(), board.ep_mask.inverse());
            }
        });
        }
        else if (string[a] === "P") {
            let piece_data = pieces_in_bracket(string, a + 1, pieceList);
            let data = lambda_on_pieces(piece_data.pieces, true);
            term.push({ type: "post", data: data });
            a = piece_data.pos;
        }
        else if (string[a] === "p") {
            let piece_data = pieces_in_bracket(string, a + 1, pieceList);
            let data = lambda_on_pieces(piece_data.pieces, false);
            term.push({ type: "post", data: data });
            a = piece_data.pos;
        }
        else if (string[a] === "m") { term.push({ type: "post", 
            data: (board: Board) =>  {return ss_and(ss_or(board.white_ss, board.black_ss), board.has_moved_ss)}}); }
        else if (string[a] === "B") {
            term.push({
                type: "post", data: (board: Board, col: boolean, pos: number, current_moves: Squareset) => {
                    let ret = new Squareset(board.game_data.width * board.game_data.height);
                    let piece = board.game_data.all_pieces[board.identify_piece(pos)];
                    let my_stoppers = piece.attributes.includes(PieceAttributes.curse_immune) ? board.stoppers
                        : col ? board.stoppers_cursed.black : board.stoppers_cursed.white;
                    let my_stop_spaces = ss_and(my_stoppers, current_moves);
                    for (; !my_stop_spaces.is_zero(); my_stop_spaces.pop()) {
                        ret.ore(get_bnb_ss(pos, my_stop_spaces.get_ls1b(), board.game_data));
                    }
                    return ret;
                }
            });
        }
        else if (string[a] === "G") {
            let piece_data = pieces_in_bracket(string, a + 1, pieceList);
            term.push({
                type: "post", data: (board: Board, col: boolean, pos: number, current_moves: Squareset) => {
                    let ret = new Squareset(board.game_data.width * board.game_data.height);
                    for (let p = 0; p < piece_data.pieces.length; p ++) {
                        let this_piece_ss = ss_and(board.piece_ss[piece_data.pieces[p]], current_moves);
                        for (; !this_piece_ss.is_zero(); this_piece_ss.pop()) {
                            ret.ore(get_bnb_ss(pos, this_piece_ss.get_ls1b(), board.game_data));
                        }
                    }
                    return ret;
                }
            });
            a = piece_data.pos;
        }
        else if (string[a] === "Z") {
            let nums = get_2_zones(string, a + 1, all_zones, width, height);
            term.push({
                type: "post", data: (board: Board, col: boolean, pos: number) => {
                    let zone = col ? board.game_data.zones[nums.num2] : board.game_data.zones[nums.num1];
                    return zone.get(pos) ? zone.inverse() : new Squareset(board.game_data.width * board.game_data.height);
                }
            });
            a = nums.pos;
        }
        else if (string[a] === "O") {
            let nums = get_2_zones(string, a + 1, all_zones, width, height);
            term.push({ type: "post", data: (board: Board, col: boolean) => { return col? board.game_data.zones[nums.num2] : board.game_data.zones[nums.num1] } });
            a = nums.pos;
        }
        //Misc
        else if (string[a] === "s") { term.push({ type: "stop"}); }
        else if (string[a] === "-") { term.push({ type: "sub"}); }
        else if (string[a] === "^") { repeat = term.length; }
    }
    //If the term had a ^, add repeat to the term
    if (repeat > -1) {
        term.push({ type: "rep", data: repeat });
    }
    return term;
}

function lambda_on_pieces(pieces: number[], inverse: boolean) {
    let data: any;
    if (pieces.length === 1) {
        data = (board: Board) => {
            return inverse ? board.piece_ss[pieces[0]].inverse() : board.piece_ss[pieces[0]];
        };
    } else if (pieces.length > 1) {
        data = (board: Board) => {
            let ret = new Squareset(board.game_data.width * board.game_data.height);
            for (let a = 0; a < pieces.length; a++) {
                ret.ore(board.piece_ss[pieces[a]]);
            }
            return inverse ? ret.inverse() : ret;
        }
    } else {
        data = (board: Board) => { return new Squareset(board.game_data.width * board.game_data.height, inverse? 1 : 0) };
    }
    return data;
}