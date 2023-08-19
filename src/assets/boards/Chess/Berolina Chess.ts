export const chess_berolina = {
  name: "Berolina Chess",
  description: "Classic Chess but with opposite pawns",
	style: "checkered",
  width: 8,
  height: 8,
  
  all_pieces: [
    {
      name: "Pawn",
      description: "Moves passively forward-diagonally one step (or 2 on its first move), captures one step forward, and promotes when reaching the back rank",
      sprite: "soldier",
      symbol: "p",
      notation: "",
      move: "i([1 1 1 2],[-1 1 1 2])Bae+[P]ae+[S]ca",
      promotions: [{ to: ["NSNR"] }],
      attributes: ["ep_captured", "ep_capturer"]
    },
    {
      name: "Rook",
      description: "Moves sideways and vertically as many spaces as it wants",
      sprite: "rook",
      symbol: "R",
      move: "[R]Ba",
      attributes: ["castle_to"]
    },
    {
      name: "Knight",
      description: "Jumps in a (2, 1) L-shaped pattern",
      sprite: "knight",
      symbol: "N",
      move: "[N]a"
    },
    {
      name: "Bishop",
      description: "Moves diagonally as many spaces as it wants",
      sprite: "bishop",
      symbol: "B",
      move: "[B]Ba"
    },
    {
      name: "Queen",
      description: "Moves like a Rook or Bishop",
      sprite: "queen",
      symbol: "Q",
      move: "[Q]Ba"
    },
    {
      name: "King",
      description: "Moves one step in any direction. Can be checked and checkmated.",
      sprite: "king",
      symbol: "K",
      move: "[K]a+i[1 0 2 -1]BemP{Rook}",
      attributes: ["royal", "castle_from"]
    }
  ],
  setup: "bR bN bB bQ bK bB bN bR 8bp",
  copy: "flip"
}