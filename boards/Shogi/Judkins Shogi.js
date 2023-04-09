preset_variants[folders.shogi].push({
    name: "Judkins Shogi",
    description: "Small version of Shogi. All promotions and drop rules are the same as Shogi. Promotion is the last 2 ranks.",
	author: "Paul Judkins",
    width: 6,
	height: 6,
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
            promotions: [{ white: 0, black: 1, to: ["+Pawn"], on: [events.enter, events.between] },
                { white: 6, black: 7, to: ["Pawn"], on: [events.enter] }],
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
            name: "Knight",
            description: "Japanese Knight. Jumps forward two spaces and sideways one. Promotes to Gold.",
            sprite: "knight",
			symbol: "n",
            move: "[JN]a",
            drop_to_zone: {white: 4, black: 5},
            promotions: [{ white: 0, black: 1, to: ["+Knight"], on: [events.enter, events.exit, events.between] }]
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
    setup: "br bb bn bs bG bK 5. bp",
    copy: "rotate",
    zones: [
        "111111 111111 000000 000000 000000 000000",
        "000000 000000 000000 000000 111111 111111",
        "000000 111111 111111 111111 111111 111111",
        "111111 111111 111111 111111 111111 000000",
        "000000 000000 111111 111111 111111 111111",
        "111111 111111 111111 111111 000000 000000",
        "000000 111111 000000 000000 000000 000000",
        "000000 000000 000000 000000 111111 000000",
    ],
    highlight: "111111 111111 000000 000000 111111 111111",
    starting_hands: {white: [], black: []}
});