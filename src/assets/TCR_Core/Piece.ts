import { Events, PieceAttributes } from "./Constants";
import { Term } from "./game_data/from_object";

export class Piece {
    name: string;
    description: string;
    sprite: string;
    angle: number;
    symbol: string;
    notation: string;
    move: Term[][][];
    move_str: string;
    attributes: PieceAttributes[];
    promotions: Promotion[];
    drop_to_zone?: {white: number, black: number};
    limit?: number; //Total max on-board
    file_limit?: number; //Max per column
    held_piece?: number;
    held_move?: number;
    flip_sprite: boolean;
    mini_sprite?: string;

    constructor(input: {
        name: string, 
        description?: string, 
        sprite: string, 
        angle?: number, 
        symbol: string,
        notation?: string,
        move: Term[][][],
        move_str: string,
        attributes?: PieceAttributes[],
        promotions?: Promotion[],
        drop_to_zone?: {white: number, black: number},
        limit?: number,
        file_limit?: number,
        held_piece?: number,
        held_move?: number,
        flip_sprite?: boolean,
        mini_sprite?: string
        }) {
            this.name = input.name;
            this.description = input.description ?? "";
            this.sprite = input.sprite;
            this.angle = input.angle ?? 0;
            this.symbol = input.symbol;
            this.notation = input.notation ?? input.symbol;
            this.move = input.move;
            this.move_str = input.move_str;
            this.attributes = input.attributes ?? [];
            this.promotions = input.promotions ?? [];
            this.drop_to_zone = input.drop_to_zone;
            this.limit = input.limit;
            this.file_limit = input.file_limit;
            this.held_piece = input.held_piece;
            this.held_move = input.held_move;
            this.flip_sprite = input.flip_sprite ?? false;
            this.mini_sprite = input.mini_sprite;
    }
}

export interface Promotion {
    white: number;
    black: number;
    to: number[];
    on: Events[];
}