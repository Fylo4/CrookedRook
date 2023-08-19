export const chess_wildebeest = {
  name: "Wildebeest Chess",
  author: "R. Wayne Schmittberger",
  description: "An 11x10 Chess variant with Camels and Wildebeests",
	style: "checkered",
  width: 11,
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
      move: "i[0 1 1 3]Bae+[S]ae+[P]ca",
      promotions: [
        { white: 1, black: 0, to: ["Q", "W"], on: ["enter"] }
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
      name: "Camel",
      description: "Jumps in a (3, 1) L-shaped pattern",
      sprite: "giraffe",
      symbol: "C",
      move: "[C]a"
    },
    {
      name: "Wildebeest",
      description: "Moves like a Knight or Camel",
      sprite: "bear",
      symbol: "W",
      move: "([N],[C])a"
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
  setup: "bR bN 2bC bW bK bQ 2bB bN bR 11bp",
  copy: "rotate",
  zones: [
    "00000000000 00000000000 00000000000 00000000000 00000000000 00000000000 00000000000 00000000000 00000000000 11111111111",
    "11111111111 00000000000 00000000000 00000000000 00000000000 00000000000 00000000000 00000000000 00000000000 00000000000"
  ]
}