import { Wins, PieceAttributes } from "../../TCR_Core/Constants";

export const xiangqi_mini = {
    name: "MiniXiangqi",
    author: "S. Kusumoto",
    description: "7x7 version of Chinese Chess",
    style: "intersection",
	width: 7,
	height: 7,
    wins: [Wins.royal_capture_n, Wins.stalemate],
    draws: [],

	all_pieces: [
		{
			name: "Peasant",
			description: "Moves one step forwards or sideways.",
            sprite: "peasant",
            symbol: "p",
            notation: "",
			move: "([So])a",
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
            name: "Cannon",
            description: "Xiangqi Cannon",
            sprite: "cannon",
            symbol: "C",
            move: "[R]Bb[L]Bab+[R]Bae",
        },
		{
            name: "Mao",
            description: "Blockable Knight",
            sprite: "knight",
			symbol: "N",
			move: "[W]ae[P]a",
		},
		{
            name: "King",
            description: "Moves one step cardinally. Must stay in the palace. Can fly to kill opposing king.",
            sprite: "king",
			symbol: "K",
			move: "[W]aZ{1 0}+[R]BP{King}",
            attributes: [PieceAttributes.royal]
		},
	],
    setup: "bR bC bN bK bN bC bR bp . 3bp . bp",
    copy: "flip",
    zones: [
        "0011100 0011100 0011100 0000000 0000000 0000000 0000000",
        "0000000 0000000 0000000 0000000 0011100 0011100 0011100",
	],
}