export const shogi_tori = {
  all_pieces: [
    {
      name: "Swallow",
      description: "Moves and captures forward one step. Promotes to Goose.",
      sprite: "kasa_peasant",
      file_limit: 2,
      move: "[S]a",
      promotions: [
        { black: 1, to: [ "Goose" ], white: 0, on: [ "enter", "exit", "between" ] }
      ],
      symbol: "S"
    },
    {
      name: "Goose",
      description: "Jumps 2 squares forward-diagonal or 2 steps backward",
      sprite: "crow",
      attributes: ["transform_on_death"],
      held_piece: "S",
      move: "([2 2 1 1],[-2 2 1 1],[0 -2 1 1])a",
      symbol: "G"
    },
    {
      name: "Left Quail",
      description: "Moves forward and down-right indefinitely and one space down-left",
      sprite: "triangle_corner",
      symbol: "L",
      move: "([0 1 1 -1],[1 -1 1 -1])Ba+[-1 -1 1 1]a"
    },
    {
      name: "Right Quail",
      description: "Moves forward and down-left indefinitely and one space down-right",
      sprite: "triangle_corner",
      angle: 270,
      symbol: "R",
      move: "([0 1 1 -1],[-1 -1 1 -1])Ba+[1 -1 1 1]a"
    },
    {
      name: "Pheasant",
      description: "Jumps one square backward-diagonally or two squares forward",
      sprite: "star3",
      symbol: "H",
      move: "([1 -1 1 1],[-1 -1 1 1],[0 2 1 1])a"
    },
    {
      name: "Crane",
      description: "Moves like a King except sideways",
      sprite: "star6",
      symbol: "C",
      move: "([F],[0 1 2 1])a"
    },
    {
      name: "Falcon",
      description: "Moves like a King except backwards",
      sprite: "elephant",
      move: "([F],[0 1 1 1],[1 0 2 1])a",
      symbol: "F",
      promotions: [
        { black: 1, on: [ "enter", "exit", "between" ], to: [ "Eagle" ], white: 0 }
      ]
    },
    {
      name: "Eagle",
      description: "Moves forward-diagonal or backwards indefinitely, two steps backward-diagonally, or 1 square sideways or forwards",
      sprite: "eagle",
      symbol: "E",
      move: "([W],[0 -1 1 -1],[1 1 4 2],[1 1 1 -1],[-1 1 1 -1])Ba",
      attributes: [ "transform_on_death" ],
      held_piece: "F"
    },
    {
      attributes: ["royal"],
      description: "Moves one step in any direction. Can be checked and checkmated.",
      move: "[K]a",
      name: "Phoenix",
      sprite: "king",
      symbol: "P"
    }
  ],
  copy: "rotate",
  description: "Bird-themed Shogi variant. Swallows (Pawns) promote on the last 2 ranks.",
  has_hand: true,
  height: 7,
  name: "Tori Shogi",
  setup: "bR bH bC bP bC bH bL 3. bF 3. 7bS 2. bS",
  style: "uncheckered",
  width: 7,
  wins: [ "royal_capture", "stalemate" ],
  zones: [
    "1111111 1111111 0000000 0000000 0000000 0000000 0000000",
    "0000000 0000000 0000000 0000000 0000000 1111111 1111111"
  ]
}