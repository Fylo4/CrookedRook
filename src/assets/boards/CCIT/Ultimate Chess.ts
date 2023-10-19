import { PieceAttributes } from "../../TCR_Core/Constants";

export const ccit_ultimate_chess = {
    name: "Ultimate Chess",
	author: "IDontSpeakFilipino",
    description: "There's so many pieces.",
	style: "checkered",
	width: 8,
	height: 8,

	all_pieces: [
		{
			name: "Peasant",
			description: "Moves passively forward one step, captures one step forward-diagonally, and promotes when reaching the back rank",
            sprite: "peasant",
            symbol: "p",
            notation: "",
			move: "[S]ae+[P]ca",
            promotions: {to: ["W", "B", "R", "Q", "Z", "H"]},
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
            description: "Jumps in a (2, 1) L-shaped pattern. Promotes to Wizard on back rank.",
            sprite: "knight",
			symbol: "N",
			move: "[N]a",
			promotions: {to: "Z"}
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
		{
			name: "Chancellor",
			description: "Moves like a Rook or Knight. Promotes to Wizard on back rank.",
			sprite: "chancellor",
			symbol: "C",
			move: "[R]Ba+[N]a",
			promotions: {to: "Z"}
		},
		{
			name: "Archbishop",
			description: "Moves like a Bishop or Knight. Promotes to Wizard on back rank.",
			sprite: "archbishop",
			symbol: "A",
			move: "[B]Ba+[N]a",
			promotions: {to: "Z"}
		},
		{
			name: "Archer",
			description: "Attacks like a bishop, however it attacks without moving. Moves one step diagonally.",
			sprite: "archer",
			symbol: "H",
			move: "[B]Bab+[F]a",
			attributes: [PieceAttributes.enemy_static]
		},
		{
			name: "Warden",
			description: "Moves passively like a Rook. Completely immobilizes nearby enemies.",
			sprite: "warden",
			symbol: "W",
			move: "[R]Bae",
			attributes: [PieceAttributes.castle_to, PieceAttributes.glue_curse, PieceAttributes.peace_curse]
		},
		{
			name: "Wizard",
			description: "Acts like a queen + knight",
			sprite: "mage",
			symbol: "Z",
			move: "[Q]Ba+[N]a",
		}
	],
    setup: "bW bC bA bQ bK bA bC bW bR bN bB 2bH bB bN bR 8bp",
    copy: "flip",
};