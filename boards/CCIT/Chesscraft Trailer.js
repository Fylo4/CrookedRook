preset_variants[folders.ccit].push({
    name: "Chesscraft Trailer",
	author: "Probably Stuart Pence",
    description: "A recreation from the Chesscraft trailer !",
	style: "checkered",
	width: 8,
	height: 8,

	all_pieces: [
		{
			name: "Pawn",
			description: "Moves passively forward one step (or 2 on its first move), captures one step forward-diagonally, and promotes when reaching the back rank",
            sprite: "pawn",
            symbol: "p",
            notation: "",
			move: "i[0 1 1 2]Ba+[S]ae+[P]ca",
            promotions: {to: ["W", "B", "R", "Q"]},
		},
		{
            name: "Rook",
            description: "Moves sideways and vertically as many spaces as it wants",
            sprite: "rook",
			symbol: "R",
			move: "[R]Ba",
			attributes: [attrib.castle_to],
		},
		{
            name: "Knight",
            description: "Jumps in a (2, 1) L-shaped pattern. Promotes to Wizard on back rank.",
            sprite: "knight",
			symbol: "N",
			move: "[N]a",
			promotions: {to: "Z"}
		},
		{
            name: "Bishop",
            description: "Moves diagonally as many spaces as it wants",
            sprite: "bishop",
			symbol: "B",
			move: "[B]Ba",
		},
		{
            name: "Queen",
            description: "Moves like a Rook or Bishop",
            sprite: "queen",
			symbol: "Q",
			move: "[Q]Ba",
		},
		{
            name: "King",
            description: "Moves one step in any direction. Can be checked and checkmated.",
            sprite: "king",
			symbol: "K",
            move: "[K]a+i[1 0 2 -1]BemP{Rook}",
			attributes: [attrib.royal, attrib.castle_from],
		},
		{
			name: "Demo Manticore",
			description: "From the Chesscraft trailer. Moves and captures by sliding like a bishop forward, a Rook sideways, a Knight, a Giraffe and an Alfil stricly backwards.",
			sprite: "Manticore",
			symbol: "M",
			move: "([Gr],[1 0 2 -1])Ba+([1 -2 1 1],[2 -2 1 1],[1 -3 1 1],[-1 -2 1 1],[-2 -2 1 1],[-1 -3 1 1])"
		}
	],
    setup: "bR bN bB bQ bK 3. 5bp . 2wM 5bp . 2wM 16. 2bM . 5wp 2bM . 5wp 3. wQ wK wB wN wR",
	active_squares: "11111000 11111011 11111011 11111111 11111111 11011111 11011111 00011111",
});