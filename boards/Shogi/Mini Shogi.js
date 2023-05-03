preset_variants[folders.shogi].push({
    name: "Mini Shogi",
    description: "Small version of Shogi. Pieces promote on the back rank as they normally do in Shogi.",
    style: "uncheckered",
	width: 5,
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
            name: "Rook",
            description: "Moves sideways and vertically as many spaces as it wants",
            sprite: "rook",
			symbol: "r",
            move: "[R]Ba",
            promotions: [{ white: 0, black: 1, to: ["Rook", "+Rook"], on: [events.enter, events.exit, events.between] }],
        },
        {
            name: "Bishop",
            description: "Moves diagonally as many spaces as it wants",
            sprite: "bishop",
            symbol: "b",
            move: "[B]Ba",
            promotions: [{ white: 0, black: 1, to: ["Bishop", "+Bishop"], on: [events.enter, events.exit, events.between] }]
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
            mini_sprite: "pawn",
            symbol: "P",
            move: "[Go]a",
            attributes: [attrib.transform_on_death],
            held_piece: "p"
        },
        {
            name: "+Rook",
            description: "Dragon King. Moves as Rook or King.",
            sprite: "dragon",
            symbol: "R",
            move: "([R],[K])Ba",
            attributes: [attrib.transform_on_death],
            held_piece: "r"
        },
        {
            name: "+Bishop",
            description: "Dragon Horse. Moves as a Bishop or King.",
            sprite: "kelpie",
            symbol: "B",
            move: "([B],[K])Ba",
            attributes: [attrib.transform_on_death],
            held_piece: "b"
        },
        {
            name: "+Silver",
            description: "Promoted silver. Moves as a Gold.",
            sprite: "hidetchi_gold",
            mini_sprite: "hidetchi_silver",
            symbol: "S",
            move: "[Si]a",
            attributes: [attrib.transform_on_death],
            held_piece: "s"
        }
	],
    setup: "br bb bs bG bK 4. bp",
    copy: "rotate",
    zones: [
        "11111 00000 00000 00000 00000",
        "00000 00000 00000 00000 11111",
        "00000 11111 11111 11111 11111",
        "11111 11111 11111 11111 00000",
    ],
    highlight: "11111 00000 00000 00000 11111",
    starting_hands: {white: [], black: []}
});