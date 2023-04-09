preset_variants[folders.xiangqi].push({
  name: "Janggi",
  description: "Korean Chess",
  width: 9,
  height: 10,
  wins: [ends.royal_capture, ends.stalemate],
  
  all_pieces: [
    {
      name: "Peasant",
      description: "Moves one step forwards or sideways.",
      sprite: "peasant",
      symbol: "P",
      move: "T{2}([1 0 2 1],[S])a+z{0 0}[P]aZ{0 0}"
    },
    {
      name: "Chariot",
      description: "Moves sideways and vertically as many spaces as it wants, Can move along palace lines",
      sprite: "rook",
      symbol: "R",
      move: "T{2}[R]Ba+z{0 0}[1 1 4 -1]aZ{0 0}"
    },
    {
      name: "Cannon",
      description: "Janggi Cannon",
      sprite: "cannon",
      symbol: "C",
      move: "[R]Bbp{C}[0 1 1 -1]Bap{C}+z{0 0}[B]Bbp{C}[0 1 1 -1]Bap{C}Z{0 0}"
    },
    {
      name: "Horse",
      description: "Blockable Knight",
      sprite: "knight",
      symbol: "H",
      move: "t{3}i[1 0 2 1]mP{E}+t{3}i[0]+T{2}[W]ae[P]a"
    },
    {
      name: "Elephant",
      description: "Blockable Zebra",
      sprite: "elephant",
      symbol: "E",
      move: "t{3}i[1 0 2 1]mP{H}+t{3}i[0]+[W]ae([1 1 1 2],[-1 1 1 2])Ba+-[N]"
    },
    {
      name: "Advisor",
      description: "Moves like General",
      sprite: "prince",
      symbol: "A",
      move: "T{2}[W]aZ{2 1}+T{2}z{0 0}[F]aZ{0 0}"
    },
    {
      name: "General",
      description: "Moves one step cardinally. Must stay in the palace. Can fly to kill opposing king. Can move along palace lines.",
      sprite: "king",
      symbol: "G",
      move: "T{2}[W]aZ{2 1}+[R]BP{King}+T{2}z{0 0}[F]aZ{0 0}+T{2}[0]",
      attributes: ["royal"]
    }
  ],
  setup: "bR bH bE bA . bA bE bH bR 4. bG 5. bC 5. bC . bP . bP . bP . bP . bP",
  copy: "rotate",
  zones: [
    "000101000 000010000 000101000 000000000 000000000 000000000 000000000 000101000 000010000 000101000",
    "000111000 000111000 000111000 000000000 000000000 000000000 000000000 000000000 000000000 000000000",
    "000000000 000000000 000000000 000000000 000000000 000000000 000000000 000111000 000111000 000111000"
  ],
  highlight: "000111000 000111000 000111000 000000000 000000000 000000000 000000000 000111000 000111000 000111000"
});