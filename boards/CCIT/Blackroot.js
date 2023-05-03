preset_variants[folders.ccit].push({
    name: "Blackroot",
	author: "zulban",
    description: "8x8 board. Each player has a king, medusa, beholders, unicorns, manticores, and cerberuses. Cerberuses promote to manticores.",
	style: "checkered",
	width: 8,
	height: 8,

	all_pieces: [
		{
			name: "Cerberus",
			description: "Moves passively like a pawn including double advance, captures like a knight or king.",
            sprite: "cerberus",
            symbol: "C",
			move: "i[0 1 1 2]Bae+[S]ae+([N],[K])ab",
            promotions: [{ to: ["NSNR"] }],
		},
		{
            name: "Beholder",
            description: "Within a 7x7 box, attacks any square with the same colour it is on. Cannot move passively.",
            sprite: "beholder",
			symbol: "B",
			move: "([F],[D],[A],[C],[G])ab",
		},
		{
            name: "Manticore",
            description: "Captures like a queen + knight, but not backwards. Moves passively like a king.",
            sprite: "manticore",
			symbol: "M",
			move: "[K]ae+([1 0 2 -1],[L],[Gr],[2 1 1 1],[-2 1 1 1],[JN])Bab",
		},
		{
            name: "Medusa",
            description: "Moves passively like a king, captures like a queen. Nearby enemy pieces cannot move passively.",
            sprite: "medusa",
			symbol: "S",
			move: "[K]ae+[Q]Bab",
			attributes: [attrib.glue_curse],
			held_move: "[K]"
		},
		{
            name: "Unicorn",
            description: "Moves passively likes a queen + knight, captures like a knight.",
            sprite: "unicorn",
			symbol: "U",
			move: "[Q]Bae+[N]a",
		},
		{
            name: "King",
            description: "The classic chess king can act one square in any direction. It has the special castling ability where it steps towards a rook and moves the rook too. Finally, a king cannot be captured. If you cannot make a move where your king is safe, you lose!",
            sprite: "king",
			symbol: "K",
            move: "[K]a",
			attributes: [attrib.royal],
		},
	],
    setup: "bM bU bB bS bK bB bU bM 8bC",
    copy: "flip",
	zones: [
		"00000000 00000000 00000000 00000000 00000000 00000000 00000000 11111111",
		"11111111 00000000 00000000 00000000 00000000 00000000 00000000 00000000",
	]
});