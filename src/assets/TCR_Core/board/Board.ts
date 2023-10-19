import { PieceAttributes } from "../Constants";
import { Term } from "../game_data/from_object";
import { GameData } from "../game_data/GameData";
import { Piece } from "../Piece";
import { Squareset } from "../Squareset";
import { _can_move, _canPass, _clear_space, _count_pieces_in_column, _find_promotions, _find_victory, _generateRepetitionCode, _get_attribute_ss, _get_attributes, _get_iron_ss, _get_solid_ss, _identify_piece, _pass, _set_from_game_data, _set_piece_space, _slots_left, _spawn_piece, _swap_spaces } from "./board_funcs";
import { _make_drop_move, _make_move, HistoryRecord } from "./make_move";
import { _parse_term, _refresh_moves, _reload_can_drop_piece_to } from "./refresh_moves";

export class Board {
    game_data: GameData;
    turn: boolean;
    turn_count: number = 0;
    turn_pos: number = 0;
    last_moved_src: number = -1;
    last_moved_dest: number = -1;
    last_moved_col: boolean = false;
    
    is_piece_locked: boolean = false;
    is_promotion_locked: boolean = false;
    piece_locked_pos: number = -1;
    multi_step_pos: number = 0;
    
    white_ss: Squareset;
    black_ss: Squareset;
    piece_ss: Squareset[];
    has_moved_ss: Squareset;
    has_attacked_ss: Squareset;
    can_move_ss: Squareset[];
    ep_mask: Squareset;
    white_attack_ss: Squareset;
    black_attack_ss: Squareset;
    checked: {white: Squareset, black: Squareset};
    stoppers_cursed: {white: Squareset, black: Squareset};
    stoppers: Squareset;
    
    victory: {val: number, message: string} = {val: -1, message: ""};
    royals_killed = { white: 0, black: 0 };
    times_checked = { white: 0, black: 0 };
    repetition_codes: number[] = []; //For all board states up to the present
    open_draw = false; //Either player can call draw without the other agreeing
    draw_move_counter = 0;
    lastWasPass = false;

    hands: {white: number[], black: number[]};
    copycat_memory: number = -1; //ID of last moved piece
    //Theoretically if we had piece x, cdpt[x] is a ss of everywhere we could drop to
    //Filled in for pieces we don't actually have in our hands
    can_drop_piece_to: {white: Squareset[], black: Squareset[]} = {white: [], black: []};
    //Can we actually make a drop move this turn? False if our hand is empty for instance
    can_drop = {white: false, black: false};

    constructor(input: BoardConstructors) {
        if ('gameData' in input) {
            //Set a bunch of stuff so the compiler's happy
            this.game_data = input.gameData;
            let size = input.gameData.width * input.gameData.height;
            this.turn = input.gameData.turn_list[0];
            this.piece_ss = [];
            this.white_ss = new Squareset(size);
            this.black_ss = new Squareset(size);
            this.can_move_ss = [];
            this.has_moved_ss = new Squareset(size);
            this.has_attacked_ss = new Squareset(size);
            this.ep_mask = new Squareset(size);
            this.checked = {black: new Squareset(size), white: new Squareset(size)};
            this.hands = JSON.parse(JSON.stringify(input.gameData.starting_hands));
            this.white_attack_ss = new Squareset(size);
            this.black_attack_ss = new Squareset(size);
            this.stoppers_cursed = {white: new Squareset(size), black: new Squareset(size)};
            this.stoppers = new Squareset(size);
            
            for (let a = 0; a < input.gameData.all_pieces.length; a++) {
                this.piece_ss.push(new Squareset(size));
            }
            for (let a = 0; a < size; a++) {
                this.can_move_ss.push(new Squareset(size));
            }
            //Set everything based on the game data
            _set_from_game_data(this, input.gameData, input.rand);
        }
        else {
            this.game_data = input.game_data; //Shallow copy- that's ok
            this.turn = input.turn;
            this.turn_count = input.turn_count;
            this.turn_pos = input.turn_pos;
            this.last_moved_src = input.last_moved_src;
            this.last_moved_dest = input.last_moved_dest;
            this.last_moved_col = input.last_moved_col;
            
            this.is_piece_locked = input.is_piece_locked;
            this.is_promotion_locked = input.is_promotion_locked;
            this.piece_locked_pos = input.piece_locked_pos;
            this.multi_step_pos = input.multi_step_pos;

            this.victory = {...input.victory};
            this.royals_killed = {...input.royals_killed};
            this.times_checked = {...input.times_checked};
            this.repetition_codes = [...input.repetition_codes];
            this.open_draw = input.open_draw;
            this.draw_move_counter = input.draw_move_counter;
            this.lastWasPass = input.lastWasPass;

            this.white_ss = new Squareset(input.white_ss);
            this.black_ss = new Squareset(input.black_ss);
            this.piece_ss = input.piece_ss.map(s => new Squareset(s));
            this.has_moved_ss = new Squareset(input.has_moved_ss);
            this.has_attacked_ss = new Squareset(input.has_attacked_ss);
            this.can_move_ss = input.can_move_ss.map(s => new Squareset(s));
            this.ep_mask = new Squareset(input.ep_mask);
            this.white_attack_ss = new Squareset(input.white_attack_ss);
            this.black_attack_ss = new Squareset(input.black_attack_ss);
            this.checked = {white: new Squareset(input.checked.white), black: new Squareset(input.checked.black)};
            this.stoppers = new Squareset(input.stoppers);
            this.stoppers_cursed = {white: new Squareset(input.stoppers_cursed.black), black: new Squareset(input.stoppers_cursed.white)};
            
            this.hands = {white: [...input.hands.white], black: [...input.hands.black]};
            this.copycat_memory = input.copycat_memory;
            this.can_drop = {...input.can_drop};
            this.can_drop_piece_to = {white: input.can_drop_piece_to.white.map(s => new Squareset(s)), 
                black: input.can_drop_piece_to.black.map(s => new Squareset(s))};
        }
    }
    
    public make_move = (src_x: number, src_y: number, dst_x: number, dst_y: number, promotion?: number): HistoryRecord => _make_move(this, src_x, src_y, dst_x, dst_y, promotion);
    public make_drop_move = (piece: number, color: boolean, destination: number, promotion?: number): HistoryRecord => _make_drop_move(this, piece, color, destination, promotion);
    public on_board = (x: number, y?: number): boolean => { return this.game_data.on_board(x, y) }
    public get_attribute_ss = (attribute: number): Squareset => _get_attribute_ss(this, attribute);
    public get_attributes = (piece: number | Piece): PieceAttributes[] => _get_attributes(this, piece);
    public get_solid_ss = (): Squareset => _get_solid_ss(this);
    public get_iron_ss = (): Squareset => _get_iron_ss(this);
    public slots_left = (piece_id: number, color: number | boolean): number => _slots_left(this, piece_id, color);
    public set_piece_space = (piece: number, col: 'w' | 'b' | 'n', pos: number, rand: any, apply_fischer?: boolean): void => _set_piece_space(this, piece, col, pos, rand, apply_fischer);
    public find_promotions = (piece_id: number, src_sq: number, end_sq: number, is_white: boolean, is_black: boolean): number[] => _find_promotions(this, piece_id, src_sq, end_sq, is_white, is_black);
    public count_pieces_in_column = (piece_id: number, column: number, color?: boolean): number =>  _count_pieces_in_column(this, piece_id, column, color);
    public parse_term = (term: Term[], term_index: number, sq: number, piece: number, col: boolean, angle?: number, is_attack: boolean = false): Squareset => _parse_term(this, term, term_index, sq, piece, col, angle, is_attack);
    public reload_can_drop_piece_to = (): void => _reload_can_drop_piece_to(this);
    public identify_piece = (square: number): number => _identify_piece(this, square);
    public refresh_moves = (): void => _refresh_moves(this);
    public spawn_piece = (square: number, piece_id: number, color: number): void => _spawn_piece(this, square, piece_id, color);
    public swap_spaces = (source: number, destination: number): void => _swap_spaces(this, source, destination);
    public clear_space = (square: number): void => _clear_space(this, square);
    public can_move = (color: boolean): boolean => _can_move(this, color);
    public find_victory = (): void => _find_victory(this);
    public pass = (): boolean => _pass(this);
    public canPass = (): boolean => _canPass(this);
    public generateRepetitionCode = (): number => _generateRepetitionCode(this);
}
type BoardConstructors = {gameData: GameData, rand: any} | Board;