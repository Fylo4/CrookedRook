preset_variants[folders.SEA].push(JSON.parse(`{
	"name": "Ouk Chaktrang",
	"author": "Cambodia",
	"description": "Ouk Chaktrang, or Cambodian Chess, is the form of chess played in Cambodia. Its rules are similar to Makruk, the Thai Chess, with some special opening moves and slight differences. Queen and bishop is replaced by seed and nobleman. Pawn start on the 3rd rank and promote to seed only. King may make first move like knight. Queen may make first move leaping forward 2 steps.",
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
	  "promotions": [{ "white": 1, "black": 0, "to": ["G"], "on": ["enter"] }]
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
      "name": "Queen",
      "description": "Moves one step diagonally",
      "sprite": "prince",
      "symbol": "G",
      "move": "i[0 2 1 1]ae+[F]a"
    },
    {
      "name": "King",
      "description": "Moves one step in any direction. Can be checked and checkmated.",
      "sprite": "king",
      "symbol": "K",
      "move": "i[N]ae+[K]a",
      "attributes": ["royal"]
    }
  ],
	"setup": "bR bH bE bG bK bE bH bR 8. 8bp",
	"copy": "rotate",
	"zones": [
		"00000000 00000000 00000000 00000000 00000000 11111111 00000000 00000000",
		"00000000 00000000 11111111 00000000 00000000 00000000 00000000 00000000"
	]
}`));