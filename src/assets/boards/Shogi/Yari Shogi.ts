import { Wins, Events, PieceAttributes } from "../../TCR_Core/Constants";

export const shogi_yari = {
    name: "Yari Shogi",
    author: "Christian Freeling",
    style: "uncheckered",
	width: 7,
	height: 9,
	has_hand: true,
	wins: [Wins.royal_capture_n, Wins.stalemate],

	all_pieces: [
		{
			name: "Pawn",
			description: "Moves and captures forward one step. Promotes to Yari Silver.",
            sprite: "kasa_peasant",
            symbol: "p",
            notation: "",
			move: "[S]a",
            drop_to_zone: {white: 4, black: 5},
            file_limit: 1,
            promotions: [{ white: 0, black: 1, to: ["P"], on: [Events.enter, Events.exit, Events.between] },
                { white: 2, black: 3, to: ["p"], on: [Events.enter, Events.between] }],
		},
		{
            name: "Yari Rook",
            description: "Moves sideways and up as many spaces as it wants (not backwards). Promotes to full Rook.",
            sprite: "rok",
			symbol: "r",
            move: "([L],[1 0 2 -1])Ba",
            drop_to_zone: {white: 4, black: 5},
            promotions: [{ white: 0, black: 1, to: ["R"], on: [Events.enter, Events.exit, Events.between] },
                { white: 2, black: 3, to: ["r"], on: [Events.enter, Events.between] }],
        },
        {
            name: "Yari Bishop",
            description: "Moves forward-diagonally one step, or forwards like a lance. Promotes to Yari Gold.",
            sprite: "bishop",
            symbol: "b",
            move: "([L],[P])Ba",
            drop_to_zone: {white: 4, black: 5},
            promotions: [{ white: 0, black: 1, to: ["B"], on: [Events.enter, Events.exit, Events.between] },
                { white: 2, black: 3, to: ["b"], on: [Events.enter, Events.between] }],
        },
		{
            name: "Yari Knight",
            description: "Moves like the Shogi Knight (up 2 over 1), or like a Lance. Promotes to Yari Gold.",
            sprite: "knight",
			symbol: "n",
            move: "([L],[JN])Ba",
            drop_to_zone: {white: 4, black: 5},
            promotions: [{ white: 0, black: 1, to: ["N"], on: [Events.enter, Events.exit, Events.between] },
                { white: 2, black: 3, to: ["n"], on: [Events.enter, Events.between] }],
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
            name: "+Pawn",
            description: "Promoted pawn. Moves as a forward/forward-diagonal one step, or backwards indefinitely",
            sprite: "hidetchi_silver",
            symbol: "P",
            move: "([S],[P],[0 -1 1 -1])Ba",
            attributes: [PieceAttributes.transform_on_death],
            held_piece: "p"
        },
        {
            name: "+Rook",
            description: "Promoted Rook. Moves like a normal Rook, including backwards movement.",
            sprite: "rook",
            symbol: "R",
            move: "[R]Ba",
            attributes: [PieceAttributes.transform_on_death],
            held_piece: "r"
        },
        {
            name: "+Bishop",
            description: "Promoted Bishop. Moves as a Gold or backwards indefinitely.",
            sprite: "hidetchi_gold",
            mini_sprite: "bishop",
            symbol: "B",
            move: "([Go],[0 -1 1 -1])Ba",
            attributes: [PieceAttributes.transform_on_death],
            held_piece: "b"
        },
        {
            name: "+Knight",
            description: "Promoted Knight. Moves as a Gold or backwards indefinitely.",
            sprite: "hidetchi_gold",
            mini_sprite: "knight",
            symbol: "N",
            move: "([Go],[0 -1 1 -1])Ba",
            attributes: [PieceAttributes.transform_on_death],
            held_piece: "n"
        },
	],
    setup: "br bn bn bK bb bb br 7. 7bp",
    copy: "rotate",
    zones: [
        "1111111 1111111 1111111 0000000 0000000 0000000 0000000 0000000 0000000",
        "0000000 0000000 0000000 0000000 0000000 0000000 1111111 1111111 1111111",
        "0000000 1111111 1111111 0000000 0000000 0000000 0000000 0000000 0000000",
        "0000000 0000000 0000000 0000000 0000000 0000000 1111111 1111111 0000000",
        "0000000 1111111 1111111 1111111 1111111 1111111 1111111 1111111 1111111",
        "1111111 1111111 1111111 1111111 1111111 1111111 1111111 1111111 0000000"
    ],
    highlight: "1111111 1111111 1111111 0000000 0000000 0000000 1111111 1111111 1111111",
}