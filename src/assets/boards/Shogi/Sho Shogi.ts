import { Wins, Events, PieceAttributes } from "../../TCR_Core/Constants";

export const shogi_sho = {
    name: "Sho Shogi",
    description: "Precursor to the modern Shogi game. No drops. Adds the Drunk Elephant, which promotes to a second King.",
    style: "uncheckered",
	width: 9,
	height: 9,
	wins: [Wins.royal_extinction, Wins.stalemate],

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
            name: "Rook",
            description: "Moves sideways and vertically as many spaces as it wants. Promotes to Dragon King.",
            sprite: "rook",
			symbol: "R",
            move: "[R]Ba",
            promotions: [{ white: 0, black: 1, to: ["Rook", "D"], on: [Events.enter, Events.exit, Events.between] }],
        },
        {
            name: "Bishop",
            description: "Moves diagonally as many spaces as it wants. Promotes to Dragon Horse.",
            sprite: "bishop",
            symbol: "B",
            move: "[B]Ba",
            promotions: [{ white: 0, black: 1, to: ["Bishop", "H"], on: [Events.enter, Events.exit, Events.between] }]
        },
        {
            name: "Lance",
            description: "Moves up as many spaces as it wants. Promotes to Gold.",
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
        {
            name: "Dragon King",
            description: "Moves as Rook or King.",
            sprite: "dragon",
            symbol: "D",
            move: "([R],[K])Ba",
        },
        {
            name: "Dragon Horse",
            description: "Moves as a Bishop or King.",
            sprite: "kelpie",
            symbol: "H",
            move: "([B],[K])Ba",
        },
        {
            name: "Drunk Elephant",
            description: "Moves like a King, except not directly backwards. Non-royal, but promotes to King.",
            sprite: "elephant",
            symbol: "E",
            move: "([F],[1 0 2 1],[S])a",
            promotions: [{ white: 0, black: 1, to: ["King"], on: [Events.enter, Events.exit, Events.between] }]
        },
	],
    setup: "bL bN bS bG bK bG bS bN bL . bR 2. bE 2. bB . 9bp",
    copy: "rotate",
    zones: [
        "111111111 111111111 111111111 000000000 000000000 000000000 000000000 000000000 000000000",
        "000000000 000000000 000000000 000000000 000000000 000000000 111111111 111111111 111111111"
    ],
    highlight: "111111111 111111111 111111111 000000000 000000000 000000000 111111111 111111111 111111111",
}