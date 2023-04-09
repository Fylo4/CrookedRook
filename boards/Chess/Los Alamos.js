preset_variants[folders.chess].push({
  name: "Los Alamos",
  author: "Unknown",
  description: "A 6x6 Chess variant with no Bishops. 1st Chess variant to be played by computers.",
  width: 6,
  height: 6,
  wins: ["royal_capture"],
  draws: ["stalemate"],
  all_pieces: [
    {
      name: "Pawn",
      description: "Moves passively forward one step, captures one step forward-diagonally, and promotes when reaching the back rank",
      sprite: "pawn",
      symbol: "p",
      notation: "",
      move: "[S]ae+[P]ba",
      promotions: [
        { white: 1, black: 0, to: ["NSNR"], on: ["enter"] }
      ]
    },
    {
      name: "Rook",
      description: "Moves sideways and vertically as many spaces as it wants",
      sprite: "rook",
      symbol: "R",
      move: "[R]Ba"
    },
    {
      name: "Knight",
      description: "Jumps in a (2, 1) L-shaped pattern",
      sprite: "knight",
      symbol: "N",
      move: "[N]a"
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
      move: "[K]a",
      attributes: ["royal"]
    }
  ],
  setup: "bR bN bQ bK bN bR 6bp",
  copy: "flip",
  zones: [
    "000000 000000 000000 000000 000000 111111",
    "111111 000000 000000 000000 000000 000000"
  ]
});