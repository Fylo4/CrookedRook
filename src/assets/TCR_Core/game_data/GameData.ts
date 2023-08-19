import { GameRules, BoardStyles, Wins, Draws, SnapModes } from "../Constants";
import { Piece } from "../Piece";
import { Squareset } from "../Squareset";
import { _from_object } from "./from_object";
import { _get_drop_zone, _on_board } from "./game_data_funcs";

export class GameData {
    name: string = "";
    code?: string; //All files loaded from server need a code
    description: string = "";
    author: string = "";
    width: number = 8;
    height: number = 8;
    castle_length: number = 2;
    turn_list: boolean[] = [false, true];
    all_pieces: Piece[] = [];
    active_squares: Squareset;
    setup: string = "";
    //Where can piece X on square Y and angle Z move to?
    move_ss: Squareset[][][] = [];
    seed: number = 0;

    wins: Wins[] = [];
    nextTurnWins: Wins[] = [];
    draws: Draws[] = [];
    royal_capture_n?: number;
    n_check?: number;
    camp?: {white: Squareset, black: Squareset};
    repetition_n?: number;
    repetition_force_n?: number;
    move_n?: number;
    move_force_n?: number;

    zones: Squareset[] = [];
    fischer_zones: number[] = [];
    mud: Squareset;
    ethereal: Squareset;
    pacifist: Squareset;
    sanctuary: Squareset;
    highlight: Squareset;
    highlight2: Squareset;
 
    style: BoardStyles = BoardStyles.checkered;
    game_rules: GameRules[] = [];
    snap_mode?: SnapModes = SnapModes.clockwise;
    starting_hands?: {white: number[], black: number[]};
    drop_to_zone?: {white: number, black: number};
    copy?: string;

    has_copy_attribute: boolean = false;
    has_random: boolean = false;
    piece_move_is_empty: boolean[] = [];

    constructor(data: any) {
        this.width = data.width ?? data.x ?? 8;
        this.height = data.height ?? data.y ?? 8;
        let size = this.width * this.height;
        this.active_squares = new Squareset(size, 1);
        this.mud = new Squareset(size);
        this.ethereal = new Squareset(size);
        this.pacifist = new Squareset(size);
        this.sanctuary = new Squareset(size);
        this.highlight = new Squareset(size);
        this.highlight2 = new Squareset(size);

        _from_object(this, data);
    }

    public on_board = (x: number, y?: number): boolean => _on_board(this, x, y);
    public get_drop_zone = (piece_id: number, color: boolean): Squareset => _get_drop_zone(this, piece_id, color);
    get_move_ss(move: number, pos: number, angle: number): Squareset {
        while (angle < 0) angle += 8;
        angle %= 8;
        return this.move_ss[move][pos][angle];
    }
    public hasHand = () => this.game_rules.includes(GameRules.has_hand);
}