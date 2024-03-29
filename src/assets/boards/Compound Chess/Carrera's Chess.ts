import { Wins, Events, PieceAttributes } from "../../TCR_Core/Constants";

export const compound_carrera = {
    name: "Carrera's Chess",
    author: "Pietro Carrera (1617)",
    description: "Adds 2 pieces, which combine the moves of knight and bishop, and knight and rook. No castling or en passant.",
	style: "checkered",
	width: 10,
	height: 8,
	wins: [Wins.royal_capture_n],
	draws: [Wins.stalemate],

	all_pieces: [
		{
			name: "Pawn",
			description: "Moves passively forward one step (or 2 on its first move), captures one step forward-diagonally, and promotes when reaching the back rank",
            sprite: "pawn",
            symbol: "p",
            notation: "",
			move: "i[0 1 1 2]Bae+[S]ae+[P]ca",
            promotions: [{ white: 1, black: 0, to: ["NSNR"], on: [Events.enter] }],
		},
		{
            name: "Rook",
            description: "Moves sideways and vertically as many spaces as it wants",
            sprite: "rook",
			symbol: "R",
			move: "[R]Ba",
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
            move: "[K]a",
			attributes: [PieceAttributes.royal],
		},
		{
            name: "Centaur",
            description: "Moves like a Knight or Bishop",
            sprite: "archbishop",
			symbol: "A",
			move: "[B]Ba+[N]a",
		},
		{
            name: "Champion",
            description: "Moves like a Knight or Rook",
            sprite: "chancellor",
			symbol: "C",
			move: "[R]Ba+[N]a",
		},
	],
    setup: "bR bA bN bB bQ bK bB bN bC bR 10bp",
    copy: "flip",
	zones: [
		"0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 1111111111",
		"1111111111 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000",
	]
}