preset_variants[folders.chess].push({
    name: "Chess",
    description: "If you insist...",
	width: 8,
	height: 8,
	has_hand: false,
	turn_list: [false, true],
	flip_colors: false,
	can_pass: false,
	wins: [ends.royal_capture],
	draws: [ends.stalemate],
    next_turn_win: true,
    castle_length: 2,

	all_pieces: [
		{
			name: "Pawn",
			description: "Moves passively forward one step (or 2 on its first move), captures one step forward-diagonally, and promotes when reaching the back rank",
            sprite: "pawn",
            symbol: "p",
            notation: "",
			move: "i[0 -1 1 2]Bae+[0 -1 1 1]ae+([1 -1 1 1],[-1 -1 1 1])ca",
            promotions: [{ white: 1, black: 0, to: ["NSNR"], on: [events.enter] }],
            attributes: [attrib.ep_captured, attrib.ep_capturer],
			held_piece: -1,
			held_move: ""
		},
		{
            name: "Rook",
            description: "Moves sideways and vertically as many spaces as it wants",
            sprite: "rook",
			symbol: "R",
			move: "[R]Ba",
			promotions: [],
			attributes: [attrib.castle_to],
			held_piece: -1,
			held_move: ""
		},
		{
            name: "Knight",
            description: "Jumps in a (2, 1) L-shaped pattern",
            sprite: "knight",
			symbol: "N",
			move: "[N]a",
			promotions: [],
			attributes: [],
			held_piece: -1,
			held_move: ""
		},
		{
            name: "Bishop",
            description: "Moves diagonally as many spaces as it wants",
            sprite: "bishop",
			symbol: "B",
			move: "[B]Ba",
			promotions: [],
			attributes: [],
			held_piece: -1,
			held_move: ""
		},
		{
            name: "Queen",
            description: "Moves like a Rook or Bishop",
            sprite: "queen",
			symbol: "Q",
			move: "[Q]Ba",
			promotions: [],
			attributes: [],
			held_piece: -1,
			held_move: ""
		},
		{
            name: "King",
            description: "Moves one step in any direction. Can be checked and checkmated.",
            sprite: "king",
			symbol: "K",
            move: "[K]a+i[1 0 2 -1]BemP{Rook}",
			promotions: [],
			attributes: [attrib.royal, attrib.castle_from],
			held_piece: -1,
			held_move: ""
		},
	],
    setup: "bR bN bB bQ bK bB bN bR 8bp",
    copy: "flip",
    starting_hands: {white: [], black: []},
	active_squares: "11111111 11111111 11111111 11111111 11111111 11111111 11111111 11111111",
	zones: [
		"00000000 00000000 00000000 00000000 00000000 00000000 00000000 11111111",
		"11111111 00000000 00000000 00000000 00000000 00000000 00000000 00000000",
	],
    mud: "00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000",
	sanctuary: "00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000",
    etherial: "00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000",
    pacifist: "00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000",
    fischer_zones: [],
});