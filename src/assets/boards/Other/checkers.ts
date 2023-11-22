import { GameRules, PieceAttributes } from "../../TCR_Core/Constants";

export const other_checkers = {
    name: "Checkers",
    description: "Checkers move one step forward-diagonally, capture by jumping, and can chain-jump. Kings can move both forward and backward.",
	style: "checkered",
	width: 8,
	height: 8,
	rules: [GameRules.berzerk],

	all_pieces: [
		{
			name: "Checker",
			description: "Moves forward-diagonally one step. Captures by jumping. Can multi-capture enemies.",
            sprite: "circle",
            symbol: "c",
            notation: "",
			move: "[P]ae+[P]ab[S]ae",
            promotions: {to: "k"},
            attributes: [PieceAttributes.berzerk, PieceAttributes.kill_between, PieceAttributes.bloodlust]
		},
		{
			name: "King",
			description: "Moves diagonally one step. Captures by jumping. Can multi-capture enemies.",
            sprite: "king",
            symbol: "k",
            notation: "",
			move: "[F]ae+[F]ab[S]ae",
            attributes: [PieceAttributes.berzerk, PieceAttributes.kill_between, PieceAttributes.bloodlust],
		},
	],
    setup: "bc . bc . bc . bc . . bc . bc . bc . bc bc . bc . bc . bc .",
    copy: "rotate",
}