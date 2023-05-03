preset_variants[folders.shogi].push({
    name: "Euro Shogi",
    description: "8x8 version of Shogi.",
    author: "Vladimír Pribylinec",
    style: "checkered",
	width: 8,
	height: 8,
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
            promotions: [{ white: 0, black: 1, to: ["+Rook"], on: [events.enter, events.exit, events.between] }],
        },
        {
            name: "Bishop",
            description: "Moves diagonally as many spaces as it wants",
            sprite: "bishop",
            symbol: "b",
            move: "[B]Ba",
            promotions: [{ white: 0, black: 1, to: ["+Bishop"], on: [events.enter, events.exit, events.between] }]
        },
		{
            name: "Knight",
            description: "Japanese Knight, with the added ability to move one step sideways",
            sprite: "knight",
			symbol: "n",
            move: "([JN],[1 0 2 1])a",
            drop_to_zone: {white: 4, black: 5},
            promotions: [{ white: 0, black: 1, to: ["+Knight"], on: [events.enter, events.exit, events.between] }]
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
            name: "+Knight",
            description: "Promoted knight. Moves as a Gold.",
            sprite: "hidetchi_gold",
            mini_sprite: "knight",
            symbol: "N",
            move: "[Go]a",
            attributes: [attrib.transform_on_death],
            held_piece: "n"
        },
	],
    setup: ". bn bb bG bK bG bn 2. br 4. bb . 8bp",
    copy: "rotate",
    zones: [
        "11111111 11111111 11111111 00000000 00000000 00000000 00000000 00000000",
        "00000000 00000000 00000000 00000000 00000000 11111111 11111111 11111111",
        "00000000 11111111 11111111 11111111 11111111 11111111 11111111 11111111",
        "11111111 11111111 11111111 11111111 11111111 11111111 11111111 00000000",
        "00000000 00000000 11111111 11111111 11111111 11111111 11111111 11111111",
        "11111111 11111111 11111111 11111111 11111111 11111111 00000000 00000000"
    ],
    highlight: "11111111 11111111 11111111 00000000 00000000 11111111 11111111 11111111"
});