preset_variants[folders.chess].push({
  name: "Horde Chess",
  author: "Unknown",
  description: "An unequal Chess variant. White has several pawns.",
  width: 8,
  height: 8,
  wins: [
    "royal_capture"
  ],
  draws: [
    "stalemate"
  ],
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
        {
          white: 1,
          black: 0,
          to: [
            "NSNR"
          ],
          on: [
            "enter"
          ]
        }
      ],
      attributes: [
        "ep_captured",
        "ep_capturer"
      ]
    },
    {
      name: "Rook",
      description: "Moves sideways and vertically as many spaces as it wants",
      sprite: "rook",
      symbol: "R",
      move: "[R]Ba",
      attributes: [
        "castle_to"
      ]
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
      name: "King",
      description: "Moves one step in any direction. Can be checked and checkmated.",
      sprite: "king",
      symbol: "K",
      move: "[K]a+i[1 0 2 -1]BemP{Rook}",
      attributes: [
        "royal",
        "castle_from"
      ]
    }
  ],
  setup: "bR bN bB bQ bK bB bN bR 8bp 9. 2wp 2. 2wp . 32wp",
  zones: [
    "00000000 00000000 00000000 00000000 00000000 00000000 00000000 11111111",
    "11111111 00000000 00000000 00000000 00000000 00000000 00000000 00000000"
  ]
})