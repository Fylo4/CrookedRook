export const other_shako = {
  name: "Shako",
  author: "Jean-Louis Cazaux",
  description: "A Chess variant featuring pieces inspired by Xiangqi",
	style: "checkered",
  width: 10,
  height: 10,
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
      name: "Cannon",
      description: "Moves like a Rook but must have an intervening piece to capture",
      sprite: "cannon",
      symbol: "C",
      move: "[R]Bb[L]Bab+[R]Bae"
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
      name: "Elephant",
      description: "Jumps like a two step Bishop",
      sprite: "elephant",
      symbol: "E",
      move: "([F],[A])a"
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
  setup: "bC 8. bC bE bR bN bB bQ bK bB bN bR bE 10bp",
  copy: "flip",
  zones: [
    "0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 1111111111",
    "1111111111 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000"
  ]
}