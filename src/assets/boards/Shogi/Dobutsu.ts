export const shogi_dobutsu = {
    name: "Dobutsu Shogi",
    description: "A simple variant to teach Shogi",
    style: "uncheckered",
    width: 3,
    height: 4,
    has_hand: true,
    wins: ["royal_capture", "stalemate"],
    all_pieces: [
      {
        name: "Pawn",
        description: "Moves and captures forward one step. Promotes to Gold.",
        sprite: "kasa_peasant",
        symbol: "P",
        move: "[S]a",
        promotions: [
          { white: 0, black: 1, to: ["Tokin"], on: ["enter"] }
        ]
      },
      {
        name: "Rook",
        description: "Moves 1 space orthogonally",
        sprite: "fortress",
        symbol: "R",
        move: "[W]a"
      },
      {
        name: "Bishop",
        description: "Moves 1 space diagonally",
        sprite: "swords",
        symbol: "B",
        move: "[F]a"
      },
      {
        name: "King",
        description: "Moves one step in any direction. Can be checked and checkmated.",
        sprite: "king",
        symbol: "K",
        move: "[K]a",
        attributes: ["royal"]
      },
      {
        name: "Tokin",
        description: "Moves like a Gold General, like a King except diagonally backwards",
        sprite: "hidetchi_gold",
        symbol: "T",
        move: "[Go]a",
        attributes: ["transform_on_death"],
        held_piece: "P"
      }
    ],
    setup: "bR bK bB . bP .",
    copy: "rotate",
    zones: [
      "111 000 000 000",
      "000 000 000 111"
    ]
  }