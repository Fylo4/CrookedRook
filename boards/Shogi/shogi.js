preset_variants[folders.shogi].push({
    name: "Shogi",
    description: "Japanese Chess. You can drop pieces after you capture them. Some niche rules are not implemented",
	width: 9,
	height: 9,
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
            promotions: [{ white: 0, black: 1, to: ["Pawn", "+Pawn"], on: [events.enter, events.exit, events.between] }],
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
            name: "Lance",
            description: "Moves up as many spaces as it wants",
            sprite: "spear",
            symbol: "l",
            move: "[L]Ba",
            promotions: [{ white: 0, black: 1, to: ["Lance", "+Lance"], on: [events.enter, events.exit, events.between] }]
        },
		{
            name: "Knight",
            description: "Japanese Knight. Jumps forward two spaces and sideways one. Promotes to Gold.",
            sprite: "knight",
			symbol: "n",
            move: "[JN]a",
            promotions: [{ white: 0, black: 1, to: ["Knight", "+Knight"], on: [events.enter, events.exit, events.between] }]
        },
        {
            name: "Silver",
            description: "Moves one step diagonally or forward. Promotes to Gold.",
            sprite: "silver",
            symbol: "s",
            move: "[Si]a",
            promotions: [{ white: 0, black: 1, to: ["Silver", "+Silver"], on: [events.enter, events.exit, events.between] }]
        },
        {
            name: "Gold",
            description: "Moves one step cardinally or forward-diagonal.",
            sprite: "gold",
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
            sprite: "gold",
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
            name: "+Lance",
            description: "Promoted lance. Moves as a Gold.",
            sprite: "gold",
            mini_sprite: "spear",
            symbol: "L",
            move: "[Go]a",
            attributes: [attrib.transform_on_death],
            held_piece: "l"
        },
        {
            name: "+Knight",
            description: "Promoted knight. Moves as a Gold.",
            sprite: "gold",
            mini_sprite: "knight",
            symbol: "N",
            move: "[Go]a",
            attributes: [attrib.transform_on_death],
            held_piece: "n"
        },
        {
            name: "+Silver",
            description: "Promoted silver. Moves as a Gold.",
            sprite: "gold",
            mini_sprite: "silver",
            symbol: "S",
            move: "[Go]a",
            attributes: [attrib.transform_on_death],
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
});