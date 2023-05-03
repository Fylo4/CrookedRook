preset_variants[folders.chess].push({
  name: "Crazyhouse",
  description: "Classic Chess but you can use pieces you capture.",
	style: "checkered",
  width: 8,
  height: 8,
  wins: ["royal_capture"],
  draws: ["stalemate"],
  castle_length: 2,
  has_hand: true,
  all_pieces: [
    {
      name: "Pawn",
      description: "Moves passively forward one step (or 2 on its first move), captures one step forward-diagonally, and promotes when reaching the back rank",
      sprite: "pawn",
      symbol: "p",
      notation: "",
      move: "i[0 1 1 2]Bae+[S]ae+[P]ca",
      promotions: [
        { white: 1, black: 0, to: ["r", "b", "n", "q"], on: ["enter"] }
      ],
	    drop_to_zone: {"white": 2, "black": 2},
      attributes: ["ep_captured", "ep_capturer"]
    },
    {
      name: "Rook",
      description: "Moves sideways and vertically as many spaces as it wants",
      sprite: "rook",
      symbol: "R",
      move: "[R]Ba",
      attributes: ["castle_to"]
    },
    {
      name: "Knight",
      description: "Jumps in a (2, 1) L-shaped pattern",
      sprite: "knight",
      symbol: "N",
      move: "[N]a"
    },
    {
      name: "Bishop",
      description: "Moves diagonally as many spaces as it wants",
      sprite: "bishop",
      symbol: "B",
      move: "[B]Ba"
    },
    {
      name: "Queen",
      description: "Moves like a Rook or Bishop",
      sprite: "queen",
      symbol: "Q",
      move: "[Q]Ba"
    },
	{
      name: "Promoted Rook",
      description: "Moves sideways and vertically as many spaces as it wants",
      sprite: "rook",
      symbol: "r",
      move: "[R]Ba",
	    held_piece: "p",
      attributes: ["transform_on_death"]
    },
    {
      name: "Promoted Knight",
      description: "Jumps in a (2, 1) L-shaped pattern",
      sprite: "knight",
      symbol: "n",
      move: "[N]a",
	    held_piece: "p",
      attributes: ["transform_on_death"]
    },
    {
      name: "Promoted Bishop",
      description: "Moves diagonally as many spaces as it wants",
      sprite: "bishop",
      symbol: "b",
      move: "[B]Ba",
	    held_piece: "p",
      attributes: ["transform_on_death"]
    },
    {
      name: "Promoted Queen",
      description: "Moves like a Rook or Bishop",
      sprite: "queen",
      symbol: "q",
      move: "[Q]Ba",
	    held_piece: "p",
      attributes: ["transform_on_death"]
    },
    {
      name: "King",
      description: "Moves one step in any direction. Can be checked and checkmated.",
      sprite: "king",
      symbol: "K",
      move: "[K]a+i[1 0 2 -1]BemP{Rook}",
      attributes: ["royal", "castle_from"]
    }
  ],
  setup: "bR bN bB bQ bK bB bN bR 8bp",
  copy: "flip",
  zones: [
    "00000000 00000000 00000000 00000000 00000000 00000000 00000000 11111111",
    "11111111 00000000 00000000 00000000 00000000 00000000 00000000 00000000",
	  "00000000 11111111 11111111 11111111 11111111 11111111 11111111 00000000"
  ]
});