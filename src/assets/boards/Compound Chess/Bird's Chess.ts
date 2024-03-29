import { Wins, Events, PieceAttributes } from "../../TCR_Core/Constants";

export const compound_bird = {
    name: "Bird's Chess",
    author: "Henry Bird (1874)",
    description: "Adds 2 pieces, which combine the moves of knight and bishop, and knight and rook. Castling length is 3.",
	style: "checkered",
	width: 10,
	height: 8,
	wins: [Wins.royal_capture_n],
	draws: [Wins.stalemate],
    castle_length: 3,

	all_pieces: [
		{
			name: "Pawn",
			description: "Moves passively forward one step (or 2 on its first move), captures one step forward-diagonally, and promotes when reaching the back rank",
            sprite: "pawn",
            symbol: "p",
            notation: "",
			move: "i[0 1 1 2]Bae+[S]ae+[P]ca",
            promotions: [{ white: 1, black: 0, to: ["NSNR"], on: [Events.enter] }],
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
            name: "Archbishop",
            description: "Moves like a Knight or Bishop",
            sprite: "archbishop",
			symbol: "A",
			move: "[B]Ba+[N]a",
		},
		{
            name: "Chancellor",
            description: "Moves like a Knight or Rook",
            sprite: "chancellor",
			symbol: "C",
			move: "[R]Ba+[N]a",
		},
	],
    setup: "bR bN bB bC bQ bK bA bB bN bR 10bp",
    copy: "flip",
	zones: [
		"0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 1111111111",
		"1111111111 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000",
	]
}