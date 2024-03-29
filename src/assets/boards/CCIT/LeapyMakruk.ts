import { PieceAttributes } from "../../TCR_Core/Constants";

export const ccit_leapy_makruk = {
    name: "LeapyMakruk",
    description: "8x8 board with Peasants on the 3rd row, which promote on the 7th row. The majority of the pieces can capture like a Knight, including the King.",
	style: "checkered",
	width: 8,
	height: 8,

	all_pieces: [
		{
			name: "Peasant",
			description: "Moves passively forward one step, captures one step forward-diagonally, and promotes when reaching the 7th rank",
            sprite: "peasant",
            symbol: "p",
            notation: "",
			move: "[S]ae+[P]ca",
            promotions: [{ white: "black_rank_2", black: "white_rank_2", to: ["NSNR"] }],
		},
		{
            name: "Empress",
            description: "Acts like a Knight and a Rook.",
            sprite: "chancellor",
			symbol: "E",
			move: "[R]Ba+[N]a",
        },
        {
            name: "Giraffe",
            description: "Acts like a knight, except instead of 2 and 1, moves 3 and 1. So, instead of the knight's 'L', the giraffe moves with a taller 'L'.",
            sprite: "giraffe",
            symbol: "G",
            move: "[C]a",
        },
        {
            name: "Gorilla",
            description: "Acts like a rook, but not backwards.",
            sprite: "gorilla",
            symbol: "R",
            move: "([1 0 2 -1],[0 1 1 -1])Ba",
        },
        {
            name: "Unicorn",
            description: "Moves passively likes a queen + knight, captures like a knight.",
            sprite: "unicorn",
            symbol: "U",
            move: "([Q],[N])Bae+[N]ab",
        },
		{
            name: "Monkey King",
            description: "Acts like a knight. Also, like a king can be put in check and checkmated.",
            sprite: "monkey_king",
			symbol: "K",
            move: "[N]a",
			attributes: [PieceAttributes.royal],
		},
	],
    setup: "bR bU bG bE bK bG bU bR 8. 8bp",
    copy: "flip",
}