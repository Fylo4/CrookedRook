import { Wins, PieceAttributes } from "../../TCR_Core/Constants";

export const xiangqi_ajax = {
    name: "Ajax Xiangqi",
    description: "Xiangqi, but each piece (besides the pawn) gains the ability to move passively one step in any direction.",
    author: "Jose Carrillo",
    style: "xiangqi",
	width: 9,
	height: 10,
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
            description: "Moves sideways and vertically as many spaces as it wants. Can also move one step passively diagonally.",
            sprite: "rook",
            symbol: "r",
            move: "[R]Ba+[K]ae",
        },
        {
            name: "Cannon",
            description: "Xiangqi Cannon. Can also move one step passively diagonally.",
            sprite: "cannon",
            symbol: "c",
            move: "[R]Bb[L]Bab+[R]Bae+[K]ae",
        },
		{
            name: "Mao",
            description: "Blockable Knight. Can also move one step passively in any direction.",
            sprite: "knight",
			symbol: "n",
			move: "[W]ae[P]a+[K]ae",
		},
		{
            name: "Elephant",
            description: "Moves exactly 2 spaces diagonally. Can be blocked. Cannot cross the river. Can also move one step passively in any direction.",
            sprite: "elephant",
			symbol: "e",
			move: "[1 1 4 2]BaZ{1 0}+[K]ae",
		},
		{
            name: "Advisor",
            description: "Moves 1 space diagonally. Must stay in the palace. Can also move one step passively cardinally.",
            sprite: "prince",
			symbol: "a",
			move: "[F]aZ{3 2}+[K]aeZ{3 2}",
		},
		{
            name: "King",
            description: "Moves one step cardinally. Must stay in the palace. Can fly to kill opposing king. Can also move one step passively diagonally.",
            sprite: "king",
			symbol: "k",
			move: "[W]aZ{3 2}+[R]BP{King}+[K]aeZ{3 2}",
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
    highlight: "000111000 000111000 000111000 000000000 000000000 000000000 000000000 000111000 000111000 000111000"
}