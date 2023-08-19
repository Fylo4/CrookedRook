export const other_metamachy = JSON.parse(`{
	"name": "Metamachy",
	"author": "Jean-Louis Cazaux",
	"description": "A board that features pieces from various regional Chess variants. On TCR, the opening setup is randomly determined; in a real game, Black would choose the opening setup.",
	"style": "checkered",
	"width": 12,
	"height": 12,
	"wins": [
	  "royal_capture"
	],
	"draws": [
	  "stalemate"
	],
	"all_pieces": [
	  {
		"name": "Prince",
		"description": "Moves like a King and can move 2 steps forward, promotes on the last rank.",
		"sprite": "commoner",
		"symbol": "P",
		"move": "[0 1 1 2]Bae+[K]a",
		"promotions": [
		  {
			"white": 1,
			"black": 0,
			"to": [
			  "Queen",
			  "Eagle",
			  "Lion"
			],
			"on": [
			  "enter"
			]
		  }
		],
		"attributes": [
		  "ep_capturer",
		  "ep_captured"
		]
	  },
	  {
		"name": "Pawn",
		"description": "Moves passively forward one or two steps, captures one step forward-diagonally, and promotes when reaching the back rank",
		"sprite": "pawn",
		"symbol": "p",
		"notation": "",
		"move": "[0 1 1 2]Bae+[S]ae+[P]ca",
		"promotions": [
		  {
			"white": 1,
			"black": 0,
			"to": [
			  "Queen",
			  "Eagle",
			  "Lion"
			],
			"on": [
			  "enter"
			]
		  }
		],
		"attributes": [
		  "ep_capturer",
		  "ep_captured"
		]
	  },
	  {
		"name": "Rook",
		"description": "Moves sideways and vertically as many spaces as it wants",
		"sprite": "rook",
		"symbol": "R",
		"move": "[R]Ba"
	  },
	  {
		"name": "Cannon",
		"description": "Moves like a Rook but must have an intervening piece in order to capture.",
		"sprite": "cannon",
		"symbol": "C",
		"move": "[R]Bb[L]Bab+[R]Bae"
	  },
	  {
		"name": "Knight",
		"description": "Jumps in a (2, 1) L-shaped pattern",
		"sprite": "knight",
		"symbol": "N",
		"move": "[N]a"
	  },
	  {
		"name": "Camel",
		"description": "Jumps in a (3, 1) L-shaped pattern",
		"sprite": "zebra",
		"symbol": "M",
		"move": "[C]a"
	  },
	  {
		"name": "Bishop",
		"description": "Moves diagonally as many spaces as it wants",
		"sprite": "bishop",
		"symbol": "B",
		"move": "[B]Ba"
	  },
	  {
		"name": "Elephant",
		"description": "Moves 2 steps diagonally, can jump over pieces",
		"sprite": "elephant",
		"symbol": "A",
		"move": "([F],[A])a"
	  },
	  {
		"name": "Lion",
		"description": "Moves like a King twice without the multi-step",
		"sprite": "lion",
		"symbol": "L",
		"move": "([K],[N],[A],[D])a"
	  },
	  {
		"name": "Eagle",
		"description": "Moves like a Bishop for one step, then like a Rook outwards",
		"sprite": "eagle",
		"symbol": "E",
		"move": "[F]ase[Gr]Ba"
	  },
	  {
		"name": "Queen",
		"description": "Moves like a Rook or Bishop",
		"sprite": "queen",
		"symbol": "Q",
		"move": "[Q]Ba"
	  },
	  {
		"name": "King",
		"description": "Moves one step in any direction. Can be checked and checkmated.",
		"sprite": "king",
		"symbol": "K",
		"move": "[K]a+i([N],[A],[D])a",
		"attributes": [
		  "royal"
		]
	  }
	],
	"fischer_zones": [
	  2,
	  3
	],
	"setup": "bC bM 3. bK bE 3. bM bC bA bR bN bB bP bL bQ bP bB bN bR bA 12bp",
	"copy": "flip",
	"zones": [
	  "000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 111111111111",
	  "111111111111 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000",
	  "000001100000 000001100000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000",
	  "000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000000000000 000001100000 000001100000"
	]
  }`)