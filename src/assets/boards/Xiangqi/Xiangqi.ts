import { Wins, PieceAttributes } from "../../TCR_Core/Constants";

export const xiangqi = {
    name: "Xiangqi",
    description: "Chinese Chess",
	width: 9,
	height: 10,
    style: "xiangqi",
    wins: [Wins.royal_capture_n, Wins.stalemate],

	all_pieces: [
		{
			name: "Peasant",
			description: "Moves one step forwards. If it crosses the river, it can move sideways.",
            sprite: "peasant",
            symbol: "p",
            notation: "",
			move: "[S]a+z{0 1}[1 0 2 1]a",
        },
        {
            name: "Rook",
            description: "Moves sideways and vertically as many spaces as it wants",
            sprite: "rook",
            symbol: "r",
            move: "[R]Ba",
        },
        {
            name: "Cannon",
            description: "Xiangqi Cannon",
            sprite: "cannon",
            symbol: "c",
            move: "[R]Bb[L]Bab+[R]Bae",
        },
		{
            name: "Mao",
            description: "Blockable Knight",
            sprite: "knight",
			symbol: "n",
			move: "[W]ae[P]a",
		},
		{
            name: "Elephant",
            description: "Moves exactly 2 spaces diagonally. Can be blocked. Cannot cross the river.",
            sprite: "elephant",
			symbol: "e",
			move: "[1 1 4 2]BaZ{1 0}+-[F]",
		},
		{
            name: "Advisor",
            description: "Moves 1 space diagonally. Must stay in the palace.",
            sprite: "prince",
			symbol: "a",
			move: "[F]aZ{white_palace black_palace}",
		},
		{
            name: "King",
            description: "Moves one step cardinally. Must stay in the palace. Can fly to kill opposing king.",
            sprite: "king",
			symbol: "k",
			move: "[W]aZ{white_palace black_palace}+[R]BP{King}",
            attributes: [PieceAttributes.royal]
		},
	],
    setup: "br bn be ba bk ba be bn br 10. bc 5. bc . bp . bp . bp . bp . bp 18. wp . wp . wp . wp . wp . wc 5. wc 10. wr wn we wa wk wa we wn wr",
    zones: [
        "111111111 111111111 111111111 111111111 111111111 000000000 000000000 000000000 000000000 000000000",
        "000000000 000000000 000000000 000000000 000000000 111111111 111111111 111111111 111111111 111111111",
        "000111000 000111000 000111000 000000000 000000000 000000000 000000000 000000000 000000000 000000000",
        "000000000 000000000 000000000 000000000 000000000 000000000 000000000 000111000 000111000 000111000",
	],
    highlight:  "000111000 000111000 000111000 000000000 000000000 000000000 000000000 000111000 000111000 000111000",
    highlight2: "000000000 000000000 010000010 101010101 000000000 000000000 101010101 010000010 000000000 000000000",
}