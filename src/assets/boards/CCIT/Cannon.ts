import { PieceAttributes } from "../../TCR_Core/Constants";

export const ccit_cannon = {
    name: "Cannon :>",
    author: "Wish_Axolotl",
    description: "Simple ; )",
	style: "checkered",
	width: 8,
	height: 9,

    all_pieces: [
        {
            name: "Peasant",
            description: "Moves passively forward one step, captures one step forward-diagonally, and promotes when reaching the back rank",
            sprite: "peasant",
            symbol: "p",
            notation: "",
            move: "[S]ae+[P]ca",
            promotions: [{ white: 0, black: 1, to: ["N","B","R","C"] }],
            attributes: [PieceAttributes.ep_captured, PieceAttributes.ep_capturer],
        },
        {
            name: "Rook",
            description: "Moves sideways and vertically as many spaces as it wants",
            sprite: "rook",
            symbol: "R",
            move: "[R]Ba",
            attributes: [PieceAttributes.castle_to],
        },
        {
            name: "Knight",
            description: "Jumps in a (2, 1) L-shaped pattern",
            sprite: "knight",
            symbol: "N",
            move: "[N]a",
        },
        {
            name: "Bishop",
            description: "Moves diagonally as many spaces as it wants",
            sprite: "bishop",
            symbol: "B",
            move: "[B]Ba",
        },
        {
            name: "Queen",
            description: "Moves like a Rook or Bishop",
            sprite: "queen",
            symbol: "Q",
            move: "[Q]Ba",
        },
        {
            name: "King",
            description: "Moves one step in any direction. Can be checked and checkmated.",
            sprite: "king",
            symbol: "K",
            move: "[K]a+i[1 0 2 -1]BemP{Rook}",
            attributes: [PieceAttributes.royal, PieceAttributes.castle_from],
        },
        {
            name: "Cannon",
            description: "Moves like a Rook, but must first jump over a piece to capture.",
            sprite: "cannon",
            symbol: "C",
            move: "[R]Bb[0 1 1 -1]Bab+[R]Bae",
        },
	],
    setup: ". bC 4. bC . bR bN bB bK bQ bB bN bR bC 6bp bC",
    copy: "flip",
    active_squares: "01000010 11111111 11111111 01111110 01111110 01111110 11111111 11111111 01000010",
    zones: [
        "00000000 01111110 00000000 00000000 00000000 00000000 00000000 00000000 00000000",
        "00000000 00000000 00000000 00000000 00000000 00000000 00000000 01111110 00000000",
    ]
}