preset_variants[folders.compound].push({
  name: "Grand Chess",
  author: "Christian Freeling",
  description: "A 10x10 Chess variant with Capablanca pieces",
  width: 10,
  height: 10,
  wins: ["royal_capture"],
  draws: ["stalemate"],
  all_pieces: [
    {
      name: "Pawn",
      description: "Moves passively forward one step (or 2 on its first move), captures one step forward-diagonally, and promotes when reaching the back rank",
      sprite: "pawn",
      symbol: "p",
      notation: "",
      move: "i[0 1 1 2]Bae+[S]ae+[P]ca",
      promotions: [
        { white: 1, black: 0, to: ["NSNR", "p"], on: ["enter"] },
        { white: 3, black: 2, to: ["NSNR"], on: ["enter"] }
      ],
      attributes: ["ep_captured", "ep_capturer"]
    },
    {
      name: "Rook",
      description: "Moves sideways and vertically as many spaces as it wants",
      sprite: "rook",
      symbol: "R",
      move: "[R]Ba",
	    limit: 2
    },
    {
      name: "Knight",
      description: "Jumps in a (2, 1) L-shaped pattern",
      sprite: "knight",
      symbol: "N",
      move: "[N]a",
	    limit: 2
    },
    {
      name: "Bishop",
      description: "Moves diagonally as many spaces as it wants",
      sprite: "bishop",
      symbol: "B",
      move: "[B]Ba",
	    limit: 2
    },
    {
      name: "Queen",
      description: "Moves like a Rook or Bishop",
      sprite: "queen",
      symbol: "Q",
      move: "[Q]Ba",
	    limit: 1
    },
    {
      name: "Marshal",
      description: "Moves like a Rook or Knight",
      sprite: "chancellor",
      symbol: "M",
      move: "[R]Ba+[N]a",
	    limit: 1
    },
    {
      name: "Cardinal",
      description: "Moves like a Bishop or Knight",
      sprite: "archbishop",
      symbol: "C",
      move: "[B]Ba+[N]a",
	    limit: 1
    },
    {
      name: "King",
      description: "Moves one step in any direction. Can be checked and checkmated.",
      sprite: "king",
      symbol: "K",
      move: "[K]a+i[1 0 2 -1]BemP{Rook}",
      attributes: ["royal"]
    }
  ],
  setup: "bR 8. bR . bN bB bQ bK bM bC bB bN . 10bp",
  copy: "flip",
  zones: [
    "0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 1111111111 1111111111 0000000000",
    "0000000000 1111111111 1111111111 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000",
	  "0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 1111111111",
    "1111111111 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000"
  ]
});