import { Wins, Events, PieceAttributes } from "../../TCR_Core/Constants";

export const hist_chatur = {
    name: "Chaturanga",
    description: "Ancient ancestor of Chess-like games. Queen is replaced with Ferz, Bishop with Alfil, Pawns lose their double-step and promote to Ferz only, and King can't castle. Win by capturing, stalemating, or baring the opponent's King.",
	style: "ashtapada",
	width: 8,
	height: 8,
    wins: [Wins.royal_capture_n, Wins.bare_royal, Wins.stalemate],

	all_pieces: [
		{
            name: "Pedati",
			description: "Moves passively forward one step, captures one step forward-diagonally, and promotes when reaching the back rank",
            sprite: "peasant",
            symbol: "p",
            notation: "",
			move: "[S]ae+[P]ba",
            promotions: [{ white: 1, black: 0, to: ["M"], on: [Events.enter] }],
		},
		{
            name: "Ratha",
            description: "Moves sideways and vertically as many spaces as it wants",
            sprite: "rook",
			symbol: "R",
			move: "[R]Ba",
			attributes: [PieceAttributes.castle_to],
		},
		{
            name: "Ashva",
            description: "Jumps in a (2, 1) L-shaped pattern",
            sprite: "knight",
			symbol: "A",
			move: "[N]a",
		},
		{
            name: "Gaja",
            description: "Jumps to the second diagonal",
            sprite: "elephant",
			symbol: "G",
			move: "[A]a",
		},
		{
            name: "Mantri",
            description: "Moves one step diagonally",
            sprite: "prince",
			symbol: "M",
			move: "[F]a"
		},
		{
            name: "Raja",
            description: "Moves one step in any direction. Can be checked and checkmated.",
            sprite: "king",
			symbol: "K",
			move: "[K]a",
			attributes: [PieceAttributes.royal],
		},
	],
    setup: "bR bA bG bM bK bG bA bR 8bp",
    copy: "flip",
	zones: [
		"00000000 00000000 00000000 00000000 00000000 00000000 00000000 11111111",
		"11111111 00000000 00000000 00000000 00000000 00000000 00000000 00000000",
	],
	highlight: "00011000 00000000 00000000 10011001 10011001 00000000 00000000 00011000"
}