preset_variants[folders.SEA].push(JSON.parse(`{
	"name": "Asean Chess",
	"author": "ASEAN-Chess Council",
	"description": "ASEAN Chess is a Southeast Asian variant developed by the ASEAN-Chess Council. Queen and bishop is move differrently Pawn start on the 3rd rank.",
	"width": 8,
	"height": 8,
	"all_pieces": [
	{
	  "name": "Pawn",
	  "description": "Moves passively forward one step, captures one step forward-diagonally, and promote when reaching the back rank",
	  "sprite": "pawn",
	  "symbol": "p",
	  "notation": "",
	  "move": "[0 1 1 1]ae+([1 1 1 1],[-1 1 1 1])ba",
	  "promotions": [{ "white": 1, "black": 0, "to": ["NSNR"], "on": ["enter"] }]
	},
    {
      "name": "Rook",
      "description": "Moves sideways and vertically as many spaces as it wants",
      "sprite": "rook",
      "symbol": "R",
      "move": "[R]Ba",
      "drop_to_zone": { "white": 4, "black": 5 }
    },
    {
      "name": "Knight",
      "description": "Jumps in a (2, 1) L-shaped pattern",
      "sprite": "knight",
      "symbol": "N",
      "move": "[N]a"
    },
    {
      "name": "Nobleman",
      "description": "Moves one step diagonal or forward",
      "sprite": "bishop",
      "symbol": "B",
      "move": "([F],[0 1 1 1])a"
    },
    {
      "name": "Queen",
      "description": "Moves one step diagonally",
      "sprite": "queen",
      "symbol": "Q",
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
	"setup": "bR bN bB bQ bK bB bN bR 8. 8bp",
	"copy": "flip",
	"zones": [
		"00000000 00000000 00000000 00000000 00000000 00000000 00000000 11111111",
         "11111111 00000000 00000000 00000000 00000000 00000000 00000000 00000000"
	]
}`));