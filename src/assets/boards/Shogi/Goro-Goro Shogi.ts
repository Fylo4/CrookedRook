import { Wins, Events, PieceAttributes } from "../../TCR_Core/Constants";

export const shogi_goro_goro = {
    name: "Goro-Goro Shogi",
    description: "A smaller version of Shogi. Pawns move and capture one step forward, Silver moves and captures one step diagonally or forward, Gold one step cardinally or diagonal-forward, and King one step in any direction. Silver and Pawn promote to move like Gold in the last 2 ranks. You can drop a piece anywhere, except only one pawn per file, and pawns cannot be dropped to the last rank. All pieces drop to their un-promoted version.",
    style: "uncheckered",
	width: 5,
	height: 6,
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
            promotions: [{ white: 0, black: 1, to: ["P"], on: [Events.enter, Events.between] },
                { white: 2, black: 3, to: ["p"], on: [Events.enter, Events.between] }],
		},
        {
            name: "Silver",
            description: "Moves one step diagonally or forward. Promotes to Gold.",
            sprite: "hidetchi_silver",
            symbol: "s",
            move: "[Si]a",
            promotions: [{ white: 0, black: 1, to: ["s", "S"], on: [Events.enter, Events.exit, Events.between] }]
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
    setup: "bs bG bK bG bs 6. 3bp",
    copy: "rotate",
    zones: [
        "11111 11111 00000 00000 00000 00000",
        "00000 00000 00000 00000 11111 11111",
        "00000 11111 00000 00000 00000 00000",
        "00000 00000 00000 00000 11111 00000",
    ],
    highlight: "11111 11111 00000 00000 11111 11111",
}