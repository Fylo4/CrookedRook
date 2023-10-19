import { Wins, Events, PieceAttributes } from "../../TCR_Core/Constants";

export const shogi = {
    name: "Shogi",
    description: "Japanese Chess. You can drop pieces after you capture them. Some niche rules are not implemented",
    style: "uncheckered",
	width: 9,
	height: 9,
	has_hand: true,
	wins: [Wins.royal_capture_n, Wins.stalemate],

	all_pieces: [
		{
			name: "Pawn",
			description: "Moves and captures forward one step. Promotes to Gold.",
            sprite: "kasa_peasant",
            symbol: "p",
            notation: "",
			move: "[S]a",
            file_limit: 1,
            promotions: [{ white: 0, black: 1, to: ["Pawn", "+Pawn"], on: [Events.enter, Events.exit, Events.between] }],
		},
		{
            name: "Rook",
            description: "Moves sideways and vertically as many spaces as it wants",
            sprite: "rook",
			symbol: "r",
            move: "[R]Ba",
            promotions: [{ white: 0, black: 1, to: ["Rook", "+Rook"], on: [Events.enter, Events.exit, Events.between] }],
        },
        {
            name: "Bishop",
            description: "Moves diagonally as many spaces as it wants",
            sprite: "bishop",
            symbol: "b",
            move: "[B]Ba",
            promotions: [{ white: 0, black: 1, to: ["Bishop", "+Bishop"], on: [Events.enter, Events.exit, Events.between] }]
        },
        {
            name: "Lance",
            description: "Moves up as many spaces as it wants",
            sprite: "spear",
            symbol: "l",
            move: "[L]Ba",
            promotions: [{ white: 0, black: 1, to: ["Lance", "+Lance"], on: [Events.enter, Events.exit, Events.between] }]
        },
		{
            name: "Knight",
            description: "Japanese Knight. Jumps forward two spaces and sideways one. Promotes to Gold.",
            sprite: "knight",
			symbol: "n",
            move: "[JN]a",
            promotions: [{ white: 0, black: 1, to: ["Knight", "+Knight"], on: [Events.enter, Events.exit, Events.between] }]
        },
        {
            name: "Silver",
            description: "Moves one step diagonally or forward. Promotes to Gold.",
            sprite: "hidetchi_silver",
            symbol: "s",
            move: "[Si]a",
            promotions: [{ white: 0, black: 1, to: ["Silver", "+Silver"], on: [Events.enter, Events.exit, Events.between] }]
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
            name: "+Pawn",
            description: "Promoted pawn. Moves as a Gold.",
            sprite: "hidetchi_gold",
            mini_sprite: "peasant",
            symbol: "P",
            move: "[Go]a",
            attributes: [PieceAttributes.transform_on_death],
            held_piece: "p"
        },
        {
            name: "+Rook",
            description: "Dragon King. Moves as Rook or King.",
            sprite: "dragon",
            symbol: "R",
            move: "([R],[K])Ba",
            attributes: [PieceAttributes.transform_on_death],
            held_piece: "r"
        },
        {
            name: "+Bishop",
            description: "Dragon Horse. Moves as a Bishop or King.",
            sprite: "kelpie",
            symbol: "B",
            move: "([B],[K])Ba",
            attributes: [PieceAttributes.transform_on_death],
            held_piece: "b"
        },
        {
            name: "+Lance",
            description: "Promoted lance. Moves as a Gold.",
            sprite: "hidetchi_gold",
            mini_sprite: "spear",
            symbol: "L",
            move: "[Go]a",
            attributes: [PieceAttributes.transform_on_death],
            held_piece: "l"
        },
        {
            name: "+Knight",
            description: "Promoted knight. Moves as a Gold.",
            sprite: "hidetchi_gold",
            mini_sprite: "knight",
            symbol: "N",
            move: "[Go]a",
            attributes: [PieceAttributes.transform_on_death],
            held_piece: "n"
        },
        {
            name: "+Silver",
            description: "Promoted silver. Moves as a Gold.",
            sprite: "hidetchi_gold",
            mini_sprite: "hidetchi_silver",
            symbol: "S",
            move: "[Go]a",
            attributes: [PieceAttributes.transform_on_death],
            held_piece: "s"
        }
	],
    setup: "bl bn bs bG bK bG bs bn bl . br 5. bb . 9bp",
    copy: "rotate",
    zones: [
        "111111111 111111111 111111111 000000000 000000000 000000000 000000000 000000000 000000000",
        "000000000 000000000 000000000 000000000 000000000 000000000 111111111 111111111 111111111"
    ],
    highlight: "111111111 111111111 111111111 000000000 000000000 000000000 111111111 111111111 111111111",
    starting_hands: {white: [], black: []}
}