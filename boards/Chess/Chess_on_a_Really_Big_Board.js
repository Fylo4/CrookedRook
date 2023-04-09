preset_variants[folders.chess].push({
  name: "Chess on a Really Big Board",
  author: "Ralph Betza",
  description: "Chess on a 16x16 board",
  width: 16,
  height: 16,
  wins: [
    "royal_capture"
  ],
  draws: [
    "stalemate"
  ],
  castle_length: 6,
  all_pieces: [
    {
      name: "Pawn",
      description: "Moves passively forward one step (or upto 6 on its first move), captures one step forward-diagonally, and promotes when reaching the back rank",
      sprite: "pawn",
      symbol: "p",
      notation: "",
      move: "i[0 1 1 6]Bae+[S]ae+[P]ca",
      promotions: [
        {
          white: 1,
          black: 0,
          to: [
            "NSNR"
          ],
          on: [
            "enter"
          ]
        }
      ],
      attributes: [
        "ep_captured",
        "ep_capturer"
      ]
    },
    {
      name: "Rook",
      description: "Moves sideways and vertically as many spaces as it wants",
      sprite: "rook",
      symbol: "R",
      move: "[R]Ba",
      attributes: [
        "castle_to"
      ]
    },
    {
      name: "Elephant",
      description: "Moves like a King or Alfil",
      sprite: "elephant",
      symbol: "E",
      move: "([K],[A])a"
    },
    {
      name: "Knight",
      description: "Jumps in a (2, 1) L-shaped pattern",
      sprite: "knight",
      symbol: "N",
      move: "[N]a"
    },
    {
      name: "Rose",
      description: "Moves like a Knight in a circular motion",
      sprite: "censor",
      symbol: "O",
      move: "[N]ase^[2 1 1 1]ase+[N]ase^[-1 2 1 1]ase"
    },
    {
      name: "Superknight",
      description: "Moves like a Knight, Camel, or Zebra",
      sprite: "dragon",
      symbol: "S",
      move: "([N],[C],[Z])a"
    },
    {
      name: "Bishop",
      description: "Moves diagonally as many spaces as it wants",
      sprite: "bishop",
      symbol: "B",
      move: "[B]Ba"
    },
    {
      name: "Unicorn",
      description: "Moves like a Dabbaba or Ferz",
      sprite: "unicorn",
      symbol: "U",
      move: "([F],[D])a"
    },
    {
      name: "Queen",
      description: "Moves like a Rook or Bishop",
      sprite: "queen",
      symbol: "Q",
      move: "[Q]Ba"
    },
    {
      name: "Chancellor",
      description: "Moves like a Rook or Knight",
      sprite: "chancellor",
      symbol: "C",
      move: "[R]Ba+[N]a"
    },
    {
      name: "Archbishop",
      description: "Moves like a Bishop or Knight",
      sprite: "archbishop",
      symbol: "A",
      move: "[B]Ba+[N]a"
    },
    {
      name: "King",
      description: "Moves one step in any direction. Can be checked and checkmated.",
      sprite: "king",
      symbol: "K",
      move: "[K]a+i[1 0 2 -1]BemP{Rook}",
      attributes: [
        "royal",
        "castle_from"
      ]
    }
  ],
  setup: "bR bN bU bE bB bO bA bQ bK bC bS bB bE bU bN bR 16bp",
  copy: "flip",
  zones: [
    "0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 1111111111111111",
    "1111111111111111 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000"
  ]
});