preset_variants[folders.chess].push({
  name: "Omega Chess",
  author: "Daniel Macdoland",
  description: "A 10x10 Chess variant with corners and leapers",
  width: 12,
  height: 12,
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
      move: "i[0 1 1 3]Bae+[S]ae+[P]ca",
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
      sprite: "knight",
      symbol: "N",
      move: "[N]a"
    },
	  {
      name: "Champion",
      description: "Jumps upto 2 spaces orthogonally or exactly 2 spaces diagonally",
      sprite: "champion",
      symbol: "C",
      move: "([D],[W],[A])a"
    },
	  {
      name: "Wizard",
      description: "Jumps in a (3, 1) L-shaped pattern or 1 square diagonally",
      sprite: "moon",
      symbol: "W",
      move: "([C],[F])a"
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
      attributes: ["royal", "castle_from"]
    }
  ],
  active_squares: "100000000001 011111111110 011111111110 011111111110 011111111110 011111111110 011111111110 011111111110 011111111110 011111111110 011111111110 100000000001",
  setup: "bW 10. bW . bC bR bN bB bQ bK bB bN bR bC 2. 10bp .",
  copy: "flip",
  zones: [
    "000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 011111111110 000000000000",
    "000000000000 011111111110 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000"
  ]
});