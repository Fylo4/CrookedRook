preset_variants[folders.shogi].push({
  name: "Wa Shogi",
  description: "Animal themed Shogi variant",
  width: 11,
  height: 11,
  has_hand: true,
  wins: ["royal_capture", "stalemate"],
  all_pieces: [
    {
      name: "Sparrow Pawn",
      description: "Moves forward one step",
      sprite: "peasant",
      symbol: "p",
      notation: "SP",
      move: "[0 1 1 1]a",
	    file_limit: 1,
      promotions: [
        { white: 0, black: 1, to: ["p", "P"], on: [ "enter", "exit", "between"] }
      ]
    },
	{
      name: "Golden Bird",
      description: "Moves 1 step orthogonally or diagonally forwards",
      sprite: "shield",
      symbol: "P",
	    notation: "GB",
      move: "([W],[P])a",
      attributes: ["transform_on_death"],
      held_piece: "p"
    },
	{
      name: "Blind Dog",
      description: "Moves 1 step orthogonally except forwards or diagonally forwards",
      sprite: "half_circle_bottom",
      symbol: "d",
      notation: "BD",
      move: "([W],[P])a+-[S]",
      promotions: [
        { white: 0, black: 1, to: ["d", "D"], on: [ "enter", "exit", "between"] }
      ]
    },
	{
      name: "Violent Wolf",
      description: "Moves 1 step orthogonally or diagonally forwards",
      sprite: "shield",
      symbol: "D",
	    notation: "VW",
      move: "([W],[P])a",
      attributes: ["transform_on_death"],
      held_piece: "d"
    },
	{
      name: "Violent Wolf",
      description: "Moves 1 step orthogonally or diagonally forwards",
      sprite: "shield",
      symbol: "v",
      notation: "VW",
      move: "([W],[P])a",
      promotions: [
        { white: 0, black: 1, to: ["v", "V"], on: [ "enter", "exit", "between"] }
      ]
    },
	{
      name: "Bear's Eyes",
      description: "Moves 1 step in any direction",
      sprite: "commoner",
      symbol: "V",
	    notation: "BE",
      move: "[K]a",
      attributes: ["transform_on_death"],
      held_piece: "V"
    },
	{
      name: "Climbing Monkey",
      description: "Moves 1 step vertically or diagonally forwards",
      sprite: "battle_axe",
      symbol: "m",
	    notation: "CM",
      move: "([P],[0 1 2 1])a",
      promotions: [
        { white: 0, black: 1, to: ["m", "M"], on: ["enter", "exit", "between"] }
      ]
    },
	{
      name: "Violent Stag",
      description: "Moves 1 step diagonally or forwards",
      sprite: "star5",
      symbol: "M",
	    notation: "VS",
      move: "([F],[S])a",
      attributes: [ "transform_on_death" ],
      held_piece: "m"
    },
    {
      name: "Violent Stag",
      description: "Moves 1 step diagonally or forwards",
      sprite: "star5",
      symbol: "t",
	    notation: "VS",
      move: "([F],[S])a",
      promotions: [
        { white: 0, black: 1, to: ["t", "T"], on: ["enter", "exit", "between"] }
      ]
    },
	{
      name: "Roaming Boar",
      description: "Moves 1 step in any direction except backwards",
      sprite: "elephant",
      symbol: "T",
	    notation: "RB",
      move: "([F],[S],[1 0 2 1])a",
      attributes: [ "transform_on_death" ],
      held_piece: "t"
    },
	{
      name: "Flying Goose",
      description: "Moves 1 step vertically or diagonally forwards",
      sprite: "battle_axe",
      symbol: "g",
	    notation: "FG",
      move: "([P],[0 1 2 1])a",
      promotions: [
        { white: 0, black: 1, to: ["g", "G"], on: ["enter", "exit", "between"] }
      ]
    },
	{
      name: "Swallow's Wings",
      description: "Moves sideways as many spaces as it wants and 1 step vertically",
      sprite: "rhombus_wide",
      symbol: "G",
	    notation: "SW",
      move: "[1 0 2 -1]Ba+[0 1 2 1]a",
      attributes: [ "transform_on_death" ],
      held_piece: "g"
    },
    {
      name: "Swallow's Wings",
      description: "Moves sideways as many spaces as it wants and 1 step vertically",
      sprite: "rhombus_wide",
      symbol: "s",
	    notation: "SW",
      move: "[1 0 2 -1]Ba+[0 1 2 1]a",
      promotions: [
        { white: 0, black: 1, to: ["s", "S"], on: ["enter", "exit", "between"] }
      ]
    },
	{
      name: "Gliding Swallow",
      description: "Moves orthogonally as many spaces as it wants",
      sprite: "rook",
      symbol: "S",
	    notation: "GS",
      move: "[R]Ba",
      attributes: [ "transform_on_death" ],
      held_piece: "s"
    },
	{
      name: "Strutting Crow",
      description: "Moves 1 step forwards or diagonally backwards",
      sprite: "star3",
      symbol: "c",
	    notation: "SC",
      move: "([S],[1 -1 1 1],[-1 -1 1 1])a",
      promotions: [
        { white: 0, black: 1, to: ["c", "C"], on: ["enter", "exit", "between"] }
      ]
    },
	{
      name: "Flying Falcon",
      description: "Moves diagonally indefinitely or 1 step forwards",
      sprite: "bishop",
      symbol: "C",
	    notation: "FF",
      move: "[B]Ba+[S]a",
      attributes: [ "transform_on_death" ],
      held_piece: "c"
    },
    {
      name: "Flying Falcon",
      description: "Moves diagonally indefinitely or 1 step forwards",
      sprite: "bishop",
      symbol: "f",
	    notation: "FF",
      move: "[B]Ba+[S]a",
      promotions: [
        { white: 0, black: 1, to: ["f", "F"], on: ["enter", "exit", "between"] }
      ]
    },
	{
      name: "Tenacious Falcon",
      description: "Moves diagonally and vertically indefinitely or 1 step sideways",
      sprite: "princess",
      symbol: "F",
	    notation: "TF",
      move: "([F],[S],[1 0 2 1])a",
      attributes: [ "transform_on_death" ],
      held_piece: "f"
    },
	{
      name: "Swooping Owl",
      description: "Moves 1 step vertically or diagonally forwards",
      sprite: "star3",
      symbol: "w",
	    notation: "SO",
      move: "([P],[1 0 2 1])a",
      promotions: [
        { white: 0, black: 1, to: ["w", "W"], on: ["enter", "exit", "between"] }
      ]
    },
	{
      name: "Cloud Eagle",
      description: "Moves vertically indefinitely, diagonally forwards 3 steps, or sideways 1 step",
      sprite: "maple",
      symbol: "W",
	    notation: "CE",
      move: "([0 1 2 -1],[1 1 1 3],[-1 1 1 3])Ba+[1 0 2 1]a",
      attributes: [ "transform_on_death" ],
      held_piece: "w"
    },
    {
      name: "Cloud Eagle",
      description: "Moves vertically indefinitely, diagonally forwards 3 steps, or sideways 1 step",
      sprite: "maple",
      symbol: "E",
	    notation: "CE",
      move: "([0 1 2 -1],[1 1 1 3],[-1 1 1 3])Ba+[1 0 2 1]a"
    },
    {
      name: "Oxcart",
      description: "Moves up as many spaces as it wants",
      sprite: "spear",
      symbol: "o",
	    notation: "OC",
      move: "[0 1 1 -1]Ba",
      promotions: [
        { white: 0, black: 1, to: ["o", "O"], on: ["enter", "exit", "between"] }
      ]
    },
	{
      name: "Plodding Ox",
      description: "Moves 1 step in all direction",
      sprite: "commoner",
      symbol: "O",
	    notation: "PO",
      move: "[K]a",
      attributes: ["transform_on_death"],
      held_piece: "o"
    },
    {
      name: "Liberated Horse",
      description: "Moves forward indefinitely or 2 steps backwards",
      sprite: "excalibur",
      symbol: "h",
	    notation: "LH",
      move: "([0 1 1 -1],[0 -1 1 2])Ba",
      promotions: [
        { white: 0, black: 1, to: ["h", "H"], on: [ "enter", "exit", "between"] }
      ]
    },
	{
      name: "Heavenly Horse",
      description: "Jumps 2 step vertically then 1 step sideways",
      sprite: "knight",
      symbol: "H",
	    notation: "HH",
      move: "([1 2 2 1],[-1 2 2 1])a",
      attributes: ["transform_on_death"],
      held_piece: "h"
    },
    {
      name: "Flying Cock",
      description: "Moves one step sideways or diagonally forwards",
      sprite: "half_circle_top",
      symbol: "y",
	    notation: "FC",
      move: "([P],[1 0 2 1])a",
      promotions: [
        { white: 0, black: 1, to: ["y", "Y"], on: [ "enter", "exit", "between"] }
      ]
    },
	{
      name: "Raiding Falcon",
      description: "Moves verically indefinitely and one step sideways or diagonally forwards",
      sprite: "ellipse_tall",
      symbol: "Y",
	    notation: "RF",
      move: "[0 1 2 -1]Ba+([P],[1 0 2 1])a",
      attributes: ["transform_on_death"],
      held_piece: "y"
    },
	{
      name: "Running Rabbit",
      description: "Moves forwards indefinitely or 1 step diagonally or backwards",
      sprite: "goblin",
      symbol: "r",
	    notation: "RR",
      move: "[0 1 1 -1]Ba+([F],[0 -1 1 1])a",
      promotions: [
        { white: 0, black: 1, to: ["u", "U"], on: [ "enter", "exit", "between"] }
      ]
    },
	{
      name: "Treacherous Fox",
      description: "Jumps 2 steps diagonally or vertically",
      sprite: "star6",
      symbol: "R",
	    notaion: "TF",
      move: "([F],[A],[0 1 2 1],[0 2 2 1])Ba",
      attributes: ["transform_on_death"],
      held_piece: "r"
    },
    {
      name: "Treacherous Fox",
      description: "Jumps 2 steps diagonally or vertically",
      sprite: "star6",
      symbol: "X",
	    notation: "TF",
      move: "([F],[A],[0 1 2 1],[0 2 2 1])Ba"
    },
    {
      name: "Crane King",
      description: "Moves 1 step in any direction. Can be checked and checkmated.",
      sprite: "king",
      symbol: "K",
	    notation: "CK",
      move: "[K]a",
      attributes: ["royal"]
    }
  ],
  setup: "bh bm bw by bt bK bv bg bc bd bo . BE 3. bs 3. bf . 3bp br 3bp bX 3bp 3. bp 3. bp 3.",
  copy: "rotate",
  zones: [
    "11111111111 11111111111 11111111111 00000000000 00000000000 00000000000 00000000000 00000000000 00000000000 00000000000 00000000000",
    "00000000000 00000000000 00000000000 00000000000 00000000000 00000000000 00000000000 00000000000 11111111111 11111111111 11111111111"
  ]
});