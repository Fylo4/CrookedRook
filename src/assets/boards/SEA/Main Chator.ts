export const sea_main_chator = JSON.parse(`{
	"name": "Main Chator",
	"author": "Malay Archipelago",
	"description": "Main Chator, or Malay Chess, is a classic board game native to Malay Archipelago and is closely descended from Chaturanga, the same ancestor as Chess. Queen and bishop is replaced by general and elephant. When a pawn reaches last rank, move backward to main diagonal line to promote to according piece of same file.",
  "style": "uncheckered",
	"width": 8,
	"height": 8,
	"all_pieces": [
	{
	  "name": "Pawn",
	  "description": "Moves passively forward one step, captures one step forward-diagonally, and promote when reaching the enemy pawn line",
	  "sprite": "courier-pawn",
	  "symbol": "p",
	  "notation": "",
	  "move": "[S]ae+[P]ba",
	  "promotions": [{ "white": 1, "black": 0, "to": ["P"], "on": ["enter"] },{ "white": 3, "black": 2, "to": ["R"], "on": ["enter"]}]
	},
	{
	  "name": "Promoting Pawn",
	  "description": "Moves passively vertically one step, captures one step forward-diagonally, and promote when reaching the main diagonal line to according piece of same file.",
	  "sprite": "courier-king",
	  "symbol": "P",
	  "move": "[0 1 2 1]ae+[P]ba",
	  "promotions": [{ "white": 5, "black": 4, "to": ["H"], "on": ["enter"] },{ "white": 7, "black": 6, "to": ["E"], "on": ["enter"] },{ "white": 9, "black": 8, "to": ["G"], "on": ["enter"] }]
	},
    {
      "name": "Boat",
      "description": "Moves sideways and vertically as many spaces as it wants",
      "sprite": "rook",
      "symbol": "R",
      "move": "[R]Ba"
    },
    {
      "name": "Horse",
      "description": "Jumps in a (2, 1) L-shaped pattern",
      "sprite": "knight",
      "symbol": "H",
      "move": "[N]a"
    },
    {
      "name": "Nobleman",
      "description": "Moves one step diagonal or forward",
      "sprite": "cook",
      "symbol": "E",
      "move": "([F],[S])a"
    },
    {
      "name": "Seed",
      "description": "Moves one step diagonally",
      "sprite": "prince",
      "symbol": "G",
      "move": "[F]a"
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
	"setup": "bR bH bE bG bK bE bH bR 8bp",
	"copy": "rotate",
	"zones": [
	  "00000000 00000000 00000000 00000000 00000000 00000000 00000000 01111110",
	  "01111110 00000000 00000000 00000000 00000000 00000000 00000000 00000000",
      "00000000 00000000 00000000 00000000 00000000 00000000 00000000 10000001",
      "10000001 00000000 00000000 00000000 00000000 00000000 00000000 00000000",
      "00000000 00000000 00000000 00000000 00000000 00000000 01000010 00000000",
      "00000000 01000010 00000000 00000000 00000000 00000000 00000000 00000000",
      "00000000 00000000 00000000 00000000 00000000 00100100 00000000 00000000",
      "00000000 00000000 00100100 00000000 00000000 00000000 00000000 00000000",
      "00000000 00000000 00000000 00000000 00011000 00000000 00000000 00000000",
      "00000000 00000000 00000000 00011000 00000000 00000000 00000000 00000000"
	],
  "highlight": "10000001 01000010 00100100 00011000 00011000 00100100 01000010 10000001"
}`)