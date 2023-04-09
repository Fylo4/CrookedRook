preset_variants[folders.chess].push({
  name: "Spartan Chess",
  author: "Steven Streetman",
  description: "A Chess variant with unequal armies",
  width: 8,
  height: 8,
  wins: ["royal_extinction"],
  draws: ["stalemate"],
  castle_length: 2,
  all_pieces: [
    {
      name: "Pawn",
      description: "Moves passively forward one step (or 2 on its first move), captures one step forward-diagonally, and promotes when reaching the back rank",
      sprite: "pawn",
      symbol: "p",
      notation: "",
      move: "i[0 1 1 2]Bae+[S]ae+[P]ba",
      promotions: [
        { white: 1, black: 0, to: ["R", "B", "N", "Q"], on: ["enter"] }
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
      name: "Persian King",
      description: "Moves one step in any direction. Can be checked and checkmated.",
      sprite: "king",
      symbol: "P",
      move: "[K]a+i[1 0 2 -1]BemP{Rook}",
      attributes: ["royal", "castle_from"]
    },
	{
      name: "Hoplite",
      description: "Moves passively diagonally forward one step (or 2 on its first move), captures one step forward, and promotes when reaching the back rank",
      sprite: "pawn",
      symbol: "h",
      notation: "",
      move: "i([1 1 1 2],[-1 1 1 2])ae+[P]ae+[S]ba",
      promotions: [
        { white: 1, black: 0, to: ["C", "W", "L", "G", "S"], on: ["enter"] }
      ]
    },
    {
      name: "Captain",
      description: "Jumps 2 squares vertically or sideways",
      sprite: "champion",
      symbol: "C",
      move: "([W],[D])a"
    },
    {
      name: "Warlord",
      description: "Moves like a Bishop or Knight",
      sprite: "archbishop",
      symbol: "W",
      move: "[B]Ba+[N]a"
    },
    {
      name: "Lieutenant",
      description: "Jumps 2 squares diagonally or passively 1 square sideways",
      sprite: "mage",
      symbol: "L",
      move: "([F],[A])a+[1 0 2 1]ae"
    },
    {
      name: "General",
      description: "Moves like a Rook or King",
      sprite: "overlord",
      symbol: "G",
      move: "[R]Ba+[F]a"
    },
    {
      name: "Spartan King",
      description: "Moves one step in any direction. Can be checked and checkmated.",
      sprite: "king",
      symbol: "S",
      move: "[K]a",
	    limit: 2,
      attributes: ["royal"]
    }
  ],
  setup: "bL bG bS bC bC bS bW bL 8bh 32. 8wp wR wN wB wQ wP wB wN wR",
  zones: [
    "00000000 00000000 00000000 00000000 00000000 00000000 00000000 11111111",
    "11111111 00000000 00000000 00000000 00000000 00000000 00000000 00000000"
  ]
});