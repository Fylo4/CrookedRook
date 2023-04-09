preset_variants[folders.shogi].push({
  name: "Tori Shogi",
  description: "Bird-themed Shogi variant",
  width: 7,
  height: 7,
  has_hand: true,
  wins: ["royal_capture", "stalemate"],
  all_pieces: [
    {
      name: "Swallow",
      description: "Moves and captures forward one step. Promotes to Goose.",
      sprite: "peasant",
      symbol: "S",
      move: "[S]a",
	    file_limit: 2,
      promotions: [
        { white: 0, black: 1, to: ["Goose"], on: [ "enter", "exit", "between"] }
      ]
    },
	{
      name: "Goose",
      description: "Jumps 2 squares forward-diagonal or 2 steps backward",
      sprite: "elephant",
      symbol: "G",
      move: "([2 2 1 1],[-2 2 1 1],[0 -2 1 1])a",
	    held_piece: "S",
      attributes: ["transform_on_death"]
    },
    {
      name: "Left Quail",
      description: "Moves forward and down-right indefinitely and one space down-left",
      sprite: "triangle_ne",
      symbol: "L",
      move: "([0 1 1 -1],[1 -1 1 -1])Ba+[-1 -1 1 1]a"
    },
    {
      name: "Right Quail",
      description: "Moves forward and down-left indefinitely and one space down-right",
      sprite: "triangle_nw",
      symbol: "R",
      move: "([0 1 1 -1],[-1 -1 1 -1])Ba+[1 -1 1 1]a"
    },
    {
      name: "Pheasant",
      description: "Jumps one square backward-diagonally or two squares forward",
      sprite: "archangel",
      symbol: "H",
      move: "([1 -1 1 1],[-1 -1 1 1],[0 2 1 1])a"
    },
    {
      name: "Crane",
      description: "Moves like a King except sideways",
      sprite: "warden",
      symbol: "C",
      move: "([F],[0 1 2 1])a"
    },
    {
      name: "Falcon",
      description: "Moves like a King except backwards",
      sprite: "commoner",
      symbol: "F",
      move: "([F],[0 1 1 1],[1 0 2 1])a",
      promotions: [
        { white: 0, black: 1, to: ["Eagle"], on: [ "enter", "exit", "between"] }
      ]
    },
    {
      name: "Eagle",
      description: "Moves forward-diagonal or backwards indefinitely, two steps backward-diagonally, or 1 square sideways or forwards",
      sprite: "princess",
      symbol: "E",
      move: "([W],[0 -1 1 -1],[1 1 4 2],[1 1 1 -1],[-1 1 1 -1])Ba",
	    held_piece: "F",
      attributes: ["transform_on_death"]
    },
    {
      name: "Phoenix",
      description: "Moves one step in any direction. Can be checked and checkmated.",
      sprite: "king",
      symbol: "P",
      move: "[K]a",
      attributes: ["royal"]
    }
  ],
  setup: "bR bH bC bP bC bH bL 3. bF 3. 7bS 2. bS",
  copy: "rotate",
  zones: [
    "1111111 1111111 0000000 0000000 0000000 0000000 0000000",
    "0000000 0000000 0000000 0000000 0000000 1111111 1111111"
  ],
  starting_hands: { "white": [], "black": [] }
});