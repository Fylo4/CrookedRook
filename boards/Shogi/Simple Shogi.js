preset_variants[folders.shogi].push({
    name: "Simple Shogi",
    author: "Yoshihisa Itsubaki",
    style: "uncheckered",
	width: 3,
	height: 5,
	has_hand: true,
	wins: [ends.royal_capture, ends.stalemate],

	all_pieces: [
		{
			name: "Pawn",
			description: "Moves and captures forward one step. Promotes to Gold.",
            sprite: "kasa_peasant",
            symbol: "p",
            notation: "",
			move: "[S]a",
            file_limit: 1,
            drop_to_zone: {white: 2, black: 3},
            promotions: [{ white: 0, black: 1, to: ["+Pawn"], on: [events.enter, events.exit, events.between] }],
		},
        {
            name: "Silver",
            description: "Moves one step diagonally or forward. Promotes to Gold.",
            sprite: "hidetchi_silver",
            symbol: "s",
            move: "[Si]a",
            promotions: [{ white: 0, black: 1, to: ["Silver", "+Silver"], on: [events.enter, events.exit, events.between] }]
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
            attributes: [attrib.royal]
        },
        {
            name: "+Pawn",
            description: "Promoted pawn. Moves as a Gold.",
            sprite: "hidetchi_gold",
            mini_sprite: "peasant",
            symbol: "P",
            move: "[Go]a",
            attributes: [attrib.transform_on_death],
            held_piece: "p"
        },
        {
            name: "+Silver",
            description: "Promoted silver. Moves as a Gold.",
            sprite: "hidetchi_gold",
            mini_sprite: "hidetchi_silver",
            symbol: "S",
            move: "[Go]a",
            attributes: [attrib.transform_on_death],
            held_piece: "s"
        }
	],
    setup: ". bK 2. bp",
    copy: "rotate",
    zones: [
        "111 000 000 000 000",
        "000 000 000 000 111",
        "000 111 111 111 111",
        "111 111 111 111 000"
    ],
    starting_hands: {white: ["s", "G"], black: ["s", "G"]}
});