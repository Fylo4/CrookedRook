export const shogi_kyoto = {
	name: "Kyoto Shogi",
	author: "Tamiya Katsuya",
	description: "A Shogi variant where pieces flip every turn",
    style: "uncheckered",
	width: 5,
	height: 5,
	wins: ["royal_capture"],
	draws: ["stalemate"],
	turn_list: ["w", "b"],
	has_hand: true,

	all_pieces: [
	{
		name: "Pawn",
		description: "Moves one step forward",
		sprite: "kasa_peasant",
		mini_sprite: "rook",
		symbol: "P",
		move: "[S]a",
		promotions: [{ white: 0, black: 0, to: ["R"], on: ["between"] }]
	},
	{
		name: "Rook",
		description: "Moves like a Chess Rook",
		sprite: "rook",
		mini_sprite: "kasa_peasant",
		symbol: "R",
		move: "[R]Ba",
		promotions: [{ white: 0, black: 0, to: ["P"], on: ["between"] }]
	},
	{
		name: "Knight",
		description: "Moves like a Chess Knight but only the forwadest moves",
		sprite: "knight",
		mini_sprite: "hidetchi_gold",
		symbol: "N",
		move: "[JN]a",
		promotions: [{ white: 0, black: 0, to: ["G"], on: ["between"] }]
	},
	{
	    name: "Gold General",
	    description: "Moves like a King but can't move diagonally backwards",
	    sprite: "hidetchi_gold",
		mini_sprite: "knight",
	    symbol: "G",
	    move: "[Go]a",
	    promotions: [{ white: 0, black: 0, to: ["N"], on: ["between"] }]
	},
	{
		name: "Bishop",
		description: "Moves like a Chess Bishop",
		sprite: "bishop",
		mini_sprite: "hidetchi_silver",
		symbol: "B",
		move: "[B]Ba",
		promotions: [{ white: 0, black: 0, to: ["S"], on: ["between"]}]
	},
	{
	    name: "Silver General",
	    description: "Moves like a King but can't move orthogonally except forwards",
	    sprite: "hidetchi_silver",
		mini_sprite: "bishop",
	    symbol: "S",
	    move: "[Si]a",
	    promotions: [{ white: 0, black: 0, to: ["B"], on: ["between"] }]
	},
	{
		name: "Tokin",
		description: "Moves like a King but can't move diagonally backwards",
		sprite: "prince",
		mini_sprite: "spear",
		symbol: "T",
		move: "[Go]a",
		promotions: [{ white: 0, black: 0, to: ["L"], on: ["between"] }]
	},
	{
	    name: "Lance",
	    description: "Moves like a Rook but only forwards",
	    sprite: "spear",
		mini_sprite: "prince",
	    symbol: "L",
	    move: "[L]Ba",
	    promotions: [{ white: 0, black: 0, to: ["T"], on: ["between"] }]
	},
	{
		name: "King",
		description: "Moves one step in any direction. Can be checked and checkmated.",
		sprite: "king",
		symbol: "K",
		move: "[K]a",
		attributes: ["royal"]
	}],
	setup: "bP bG bK bS bT",
	copy: "rotate",
	zones: [
		"11111 11111 11111 11111 11111"
	]
}