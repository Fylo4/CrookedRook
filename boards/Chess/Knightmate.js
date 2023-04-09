preset_variants[folders.chess].push({
  name: "Knightmate",
  author: "Bruce Zimov",
  description: "Chess variant where Knight and King switch roles",
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
        { white: 1, black: 0, to: ["NSNR"], on: ["enter"] }
      ],
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
      sprite: "centaur_king",
      symbol: "N",
      move: "[N]a+i[1 0 2 -1]BemP{Rook}",
      attributes: ["royal", "castle_from"]
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
      name: "King",
      description: "Moves one step in any direction. Can be checked and checkmated.",
      sprite: "commoner",
      symbol: "K",
      move: "[K]a"
    }
  ],
  setup: "bR bK bB bQ bN bB bK bR 8bp",
  copy: "flip",
  zones: [
    "00000000 00000000 00000000 00000000 00000000 00000000 00000000 11111111",
    "11111111 00000000 00000000 00000000 00000000 00000000 00000000 00000000"
  ]
})