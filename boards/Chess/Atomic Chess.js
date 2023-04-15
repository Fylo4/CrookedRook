preset_variants[folders.chess].push({
  name: "Atomic Chess",
  description: "Chess, but every capture is an explosion. Pawns are immune to the explosions.",
  width: 8,
  height: 8,
  wins: ["royal_capture"],
  draws: ["stalemate"],
  castle_length: 2,
  all_pieces: [
    {
      name: "Pawn",
      description: "Moves passively forward one step (or 2 on its first move), captures one step forward-diagonally, and promotes when reaching the back rank",
      sprite: "pawn",
      symbol: "p",
      notation: "",
			move: "i[0 1 1 2]Bae+[S]ae+[P]ca",
      promotions: [
        { white: 1, black: 0, to: ["NSNR"], on: [events.enter] }
      ],
	    held_move: "[K]",
      attributes: ["ep_captured", "ep_capturer", "fireball", "bomb", "burn_attack", "burn_allies", "burn_immune"]
    },
    {
      name: "Rook",
      description: "Moves sideways and vertically as many spaces as it wants",
      sprite: "rook",
      symbol: "R",
      move: "[R]Ba",
	    held_move: "[K]",
      attributes: ["castle_to", "fireball", "bomb", "burn_attack", "burn_allies"]
    },
    {
      name: "Knight",
      description: "Jumps in a (2, 1) L-shaped pattern",
      sprite: "knight",
      symbol: "N",
      move: "[N]a",
	    held_move: "[K]",
      attributes: ["fireball", "bomb", "burn_attack", "burn_allies"]
    },
    {
      name: "Bishop",
      description: "Moves diagonally as many spaces as it wants",
      sprite: "bishop",
      symbol: "B",
      move: "[B]Ba",
	    held_move: "[K]",
      attributes: ["fireball", "bomb", "burn_attack", "burn_allies"]
    },
    {
      name: "Queen",
      description: "Moves like a Rook or Bishop",
      sprite: "queen",
      symbol: "Q",
      move: "[Q]Ba",
	    held_move: "[K]",
      attributes: ["fireball", "bomb", "burn_attack", "burn_allies"]
    },
    {
      name: "King",
      description: "Moves one step in any direction. Can be checked and checkmated.",
      sprite: "king",
      symbol: "K",
      move: "[K]a+i[1 0 2 -1]BemP{Rook}",
	    held_move: "[K]",
      attributes: ["royal", "castle_from", "fireball", "bomb", "burn_attack", "burn_allies"]
    }
  ],
  setup: "bR bN bB bQ bK bB bN bR 8bp",
  copy: "flip",
  zones: [
    "00000000 00000000 00000000 00000000 00000000 00000000 00000000 11111111",
    "11111111 00000000 00000000 00000000 00000000 00000000 00000000 00000000"
  ]
});