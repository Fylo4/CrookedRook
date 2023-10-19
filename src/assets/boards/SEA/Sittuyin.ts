export const sea_sittuyin = JSON.parse(`{
  "name": "Sittuyin",
  "author": "Myanmar",
  "description": "Sittuyin, or Burmese Chess is a classic board game native to Myanmar and is very similar to Makruk. At the start of the game, players take turns placing pieces on their side of the board. Rooks must be placed on the back rank. When a pawn reaches the main diagonal, it can promote to general. You can also promote if it is your last pawn. You can only promote if you have no other general on the board. Promotion is performed as its own turn, without moving.",
  "style": "uncheckered",
  "width": 8,
  "height": 8,
  "has_hand": true,
  "drop_to_zone": { "white": 2, "black": 3 },
  "force_drop": true,
  "destroy_on_capture": true,
  "all_pieces": [
    {
      "name": "Pawn",
      "description": "Moves passively forward one step, captures one step forward-diagonally, and can promote when reaching the main diagonal.",
      "sprite": "courier-pawn",
      "symbol": "p",
      "notation": "",
      "move": "[S]ae+[P]ba+z{1 0}r{G}[0]+ur{G}[0]",
      "promotions": [
        { "white": 6, "black": 6, "to": ["G"], "on": ["self"] }
      ]
    },
    {
      "name": "Chariot",
      "description": "Moves sideways and vertically as many spaces as it wants",
      "sprite": "rook",
      "symbol": "R",
      "move": "[R]Ba",
      "drop_to_zone": { "white": 4, "black": 5 }
    },
    {
      "name": "Horse",
      "description": "Jumps in a (2, 1) L-shaped pattern",
      "sprite": "knight",
      "symbol": "H",
      "move": "[N]a"
    },
    {
      "name": "Elephant",
      "description": "Moves one step diagonal or forward",
      "sprite": "elephant",
      "symbol": "E",
      "move": "([F],[S])a"
    },
    {
      "name": "General",
      "description": "Moves one step diagonally",
      "sprite": "prince",
      "symbol": "G",
      "move": "[F]a",
      "limit": 1
    },
    {
      "name": "King",
      "description": "Moves one step in any direction. Can be checked and checkmated.",
      "sprite": "king",
      "symbol": "K",
      "move": "[K]a",
      "attributes": ["royal"]
    }
  ],
  "setup": "20. 8bp",
  "copy": "rotate",
  "zones": [
    "00000000 00000000 00000000 00000000 00011000 00100100 01000010 10000001",
    "10000001 01000010 00100100 00011000 00000000 00000000 00000000 00000000",
    "00000000 00000000 00000000 00000000 00000000 00001111 11111111 11111111",
    "11111111 11111111 11110000 00000000 00000000 00000000 00000000 00000000",
    "00000000 00000000 00000000 00000000 00000000 00000000 00000000 11111111",
    "11111111 00000000 00000000 00000000 00000000 00000000 00000000 00000000",
    "11111111 11111111 11111111 11111111 11111111 11111111 11111111 11111111"
  ],
  "starting_hands": {
    "white": ["K", "G", "E", "E", "H", "H", "R", "R"],
    "black": ["K", "G", "E", "E", "H", "H", "R", "R"]
  },
  "highlight": "10000001 01000010 00100100 00011000 00011000 00100100 01000010 10000001"
}`)