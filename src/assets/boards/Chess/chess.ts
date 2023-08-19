import { PieceAttributes } from "../../TCR_Core/Constants";

export const chess = {
    name: "Chess",
    description: "Classic Chess, with some slight differences. Some endgame rules (50 move, repetition, etc) aren't implemented. Check/checkmate isn't enforced, you win by capturing the king. Since check isn't detected, you can castle from, through, and into check.",
	style: "checkered",
	width: 8,
	height: 8,
	draws: ["stalemate", "repetition_3", "repetition_force_5", "moves_50", "moves_force_75"],
	next_turn_wins: ['royal_capture'],

	all_pieces: [
		{
			name: "Pawn",
			description: "Moves passively forward one step (or 2 on its first move), captures one step forward-diagonally, and promotes when reaching the back rank",
            sprite: "pawn",
            symbol: "p",
            notation: "",
			move: "i[0 1 1 2]Bae+[S]ae+[P]ca",
            promotions: {to: "NSNR"},
            attributes: [PieceAttributes.ep_captured, PieceAttributes.ep_capturer, PieceAttributes.restart_timer],
		},
		{
            name: "Rook",
            description: "Moves sideways and vertically as many spaces as it wants",
            sprite: "rook",
			symbol: "R",
			move: "[R]Ba",
			attributes: [PieceAttributes.castle_to],
			angle: -15,
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
	],
    setup: "bR bN bB bQ bK bB bN bR 8bp",
    copy: "flip",
}