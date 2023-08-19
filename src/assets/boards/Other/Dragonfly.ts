import { Wins, Events, PieceAttributes } from "../../TCR_Core/Constants";

export const other_dragonfly = {
    name: "Dragonfly",
    author: "Christian Freeling",
    description: "Captured pieces go to your hand. You can promote to a piece in your opponent's hand, removing it from their hand. You cannot move a pawn to the last rank if your opponent has no held pieces. Pawns are destroyed.",
	style: "checkered",
	width: 7,
	height: 7,
	wins: [Wins.royal_capture_n],
	draws: [Wins.stalemate],
    castle_length: 2,
	has_hand: true,

	all_pieces: [
		{
			name: "Pawn",
			description: "Moves passively forward one step, captures one step forward-diagonally, and promotes when reaching the back rank to a piece from opponent's hand.",
            sprite: "peasant",
            symbol: "p",
            notation: "",
			move: "z{2 3}[S]ae+z{2 3}[P]ca+h[S]ae+h[P]ca",
            promotions: [{ white: 1, black: 0, to: [], on: [Events.enter] }],
            attributes: [PieceAttributes.promote_from_opp_hand, PieceAttributes.destroy_on_capture],
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
            name: "King",
            description: "Moves one step in any direction. Can be checked and checkmated.",
            sprite: "king",
			symbol: "K",
            move: "[K]a+i[1 0 2 -1]BemP{Rook}",
			attributes: [PieceAttributes.royal, PieceAttributes.castle_from],
		},
	],
    setup: "bR bB bB bK bN bN bR 7bp",
    copy: "flip",
	zones: [
		"0000000 0000000 0000000 0000000 0000000 0000000 1111111",
		"1111111 0000000 0000000 0000000 0000000 0000000 0000000",
		"0000000 0000000 1111111 1111111 1111111 1111111 1111111",
		"1111111 1111111 1111111 1111111 1111111 0000000 0000000",
	]
}