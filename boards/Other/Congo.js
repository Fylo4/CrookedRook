preset_variants[folders.other].push({
  name: "Congo",
  author: "Damiel Freeling",
  description: "A 7x7 board with Xiangqi like elements. Monkeys currently cannot chain captures.",
  width: 7,
  height: 7,
  wins: ["royal_capture"],
  draws: ["stalemate"],
  all_pieces: [
    {
      name: "Pawn",
      description: "Moves passively forward one step (or 2 on its first move), captures one step forward-diagonally, and promotes when reaching the back rank",
      sprite: "peasant",
      symbol: "p",
      notation: "",
      move: "([S],[P])a+z{3 2}[0 -1 1 2]Bae",
      promotions: [
        { white: 5, black: 4, to: ["S"], on: ["enter"] }
      ]
    },
    {
      name: "Superpawn",
      description: "Moves and captures forwards or sideways, passively move two spaces backwards",
      sprite: "soldier",
      symbol: "S",
      move: "([S],[P],[1 0 2 1])a+([0 -1 1 2],[1 -1 1 2],[-1 -1 1 2])Bae"
    },
    {
      name: "Elephant",
      description: "Jumps like a two step Rook",
      sprite: "elephant",
      symbol: "E",
      move: "([W],[D])a"
    },
    {
      name: "Zebra",
      description: "Jumps in a (2, 1) L-shaped pattern",
      sprite: "zebra",
      symbol: "Z",
      move: "[N]a"
    },
    {
      name: "Giraffe",
      description: "Moves and captures 2 steps away, moves passively like a King",
      sprite: "giraffe",
      symbol: "G",
      move: "([D],[A])a+[K]ae"
    },
    {
      name: "Monkey",
      description: "Moves like a King, captures like a Checkers piece",
      sprite: "chimpanzee",
      symbol: "M",
      move: "[K]ba[S]ae+[K]ae",
      attributes: ["kill_between"]
    },
    {
      name: "Crocodile",
      description: "Moves like a King and towards the River or along the River if it's in the River already",
      sprite: "kelpie",
      symbol: "C",
      move: "[K]a+z{0 1}[0 1 1 -1]BaO{1 0}+z{1 0}[0 -1 1 -1]BaO{0 1}+z{6 6}[1 0 2 -1]Ba"
    },
    {
      name: "Lion",
      description: "Moves one step in any direction, trapped in a 3x3 palace, captures opposing Lion if a Queen's move away",
      sprite: "lion",
      symbol: "L",
      move: "[K]aZ{2 3}+[Q]BP{Lion}",
      attributes: ["royal"]
    }
  ],
  setup: "bG bM bE bL bE bC bZ 7bp",
  copy: "flip",
  zones: [
    "0000000 0000000 0000000 0000000 1111111 1111111 1111111",
    "1111111 1111111 1111111 0000000 0000000 0000000 0000000",
    "0000000 0000000 0000000 0000000 0011100 0011100 0011100",
    "0011100 0011100 0011100 0000000 0000000 0000000 0000000",
    "0000000 0000000 0000000 0000000 0000000 0000000 1111111",
    "1111111 0000000 0000000 0000000 0000000 0000000 0000000",
    "0000000 0000000 0000000 1111111 0000000 0000000 0000000"
  ]
});