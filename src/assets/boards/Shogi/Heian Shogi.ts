import { Wins, Events, PieceAttributes } from "../../TCR_Core/Constants";

export const shogi_heian = {
    name: "Heian Shogi",
    description: "Precursor to the modern Shogi games. Reconstructed rules are speculative. No drops. Everything except King and Gold can promote to Gold in the last 3 ranks.",
    style: "uncheckered",
	width: 8,
	height: 8,
	wins: [Wins.royal_capture_n, Wins.stalemate],

	all_pieces: [
		{
			name: "Pawn",
			description: "Moves and captures forward one step. Promotes to Gold.",
            sprite: "kasa_peasant",
            symbol: "p",
            notation: "",
			move: "[S]a",
            promotions: [{ white: 0, black: 1, to: ["Pawn", "Gold"], on: [Events.enter, Events.exit, Events.between] }],
		},
        {
            name: "Lance",
            description: "Moves up as many spaces as it wants",
            sprite: "spear",
            symbol: "L",
            move: "[L]Ba",
            promotions: [{ white: 0, black: 1, to: ["Lance", "Gold"], on: [Events.enter, Events.exit, Events.between] }]
        },
		{
            name: "Knight",
            description: "Japanese Knight. Jumps forward two spaces and sideways one. Promotes to Gold.",
            sprite: "knight",
			symbol: "N",
            move: "[JN]a",
            promotions: [{ white: 0, black: 1, to: ["Knight", "Gold"], on: [Events.enter, Events.exit, Events.between] }]
        },
        {
            name: "Silver",
            description: "Moves one step diagonally or forward. Promotes to Gold.",
            sprite: "hidetchi_silver",
            symbol: "S",
            move: "[Si]a",
            promotions: [{ white: 0, black: 1, to: ["Silver", "Gold"], on: [Events.enter, Events.exit, Events.between] }]
        },
        {
            name: "Gold",
            description: "Moves one step cardinally or forward-diagonal.",
            sprite: "hidetchi_gold",
            symbol: "G",
            move: "[Go]a"
        },
		{
            name: "King",
            description: "Moves one step in any direction. Can be checked and checkmated.",
            sprite: "king",
			symbol: "K",
			move: "[K]a",
            attributes: [PieceAttributes.royal]
        },
	],
    setup: "bL bN bS bG bK bS bN bL 8. 8bp",
    copy: "rotate",
    zones: [
        "11111111 11111111 11111111 00000000 00000000 00000000 00000000 00000000",
        "00000000 00000000 00000000 00000000 00000000 11111111 11111111 11111111"
    ],
    highlight: "11111111 11111111 11111111 00000000 00000000 11111111 11111111 11111111",
    starting_hands: {white: [], black: []}
}