preset_variants[folders.ccit].push({
    name: "Crow Chess",
    author: "Fylo",
    description: "A variant containing Crows",
    width: 5,
    height: 8,
    wins: ["royal_capture", "stalemate"],
    all_pieces: [
      {
        name: "Crow Pawn",
        description: "Moves passively forward or sideways one step, captures one step forward-diagonally",
        sprite: "lady",
        symbol: "p",
        notation: "",
        move: "([S],[1 0 2 1])ba+[P]ae"
      },
      {
        name: "Crow",
        description: "Jumps exactly 2 spaces orthgonally",
        sprite: "crow",
        symbol: "C",
        move: "[D]a"
      },
      {
        name: "Knight",
        description: "Jumps in a (2, 1) L-shaped pattern",
        sprite: "knight",
        symbol: "N",
        move: "[N]a"
      },
      {
        name: "Ferz",
        description: "Moves one space diagonally",
        sprite: "swords",
        symbol: "F",
        move: "[F]a"
      },
      {
        name: "Ferz King",
        description: "Moves one step diagonally. Can be checked and checkmated.",
        sprite: "sultan",
        symbol: "K",
        move: "[F]a",
        attributes: [attrib.royal]
      }
    ],
    setup: "bN bC bK bC bN bC 3bF bC 5bp",
    copy: "rotate"
  });