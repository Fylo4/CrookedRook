import { Wins, PieceAttributes } from "../../TCR_Core/Constants";

export const xiangqi_sanho = {
    all_pieces:
    [
      {
        name: "Soldier",
        description: "The Soldier can move either one space forward or one space sideways.",
        sprite: "soldier",
        symbol: "s",
        notation: "s-",
        move: "[So]a",
        promotions: { white: "black_ranks_2", black: "white_ranks_2", to: "S" },
        file_limit: 1
      },
      {
        name: "Guard Soldier",
        description: "The Guard Soldier is a leaping piece that moves one step in any direction.",
        sprite: "commoner",
        symbol: "S",
        notation: "S-",
        move: "[K]a",
        attributes: [ "transform_on_death" ],
        held_piece: "s"
      },
      {
        description: "The Chariot is a rider piece that moves sideways and vertically as many spaces as it wants, but it cannot hop over another piece.",
        move: "[R]Ba",
        name: "Chariot",
        notation: "R-",
        sprite: "rook",
        symbol: "R"
      },
      {
        description: "The Horse is a leaping piece that moves to the nearest squares that are not on the same rank, file, or diagonal.",
        move: "[N]a",
        name: "Horse",
        notation: "H-",
        sprite: "knight",
        symbol: "H"
      },
      {
        description: "The Elephant is a leaping piece that moves diagonally one or two spaces.",
        move: "[F]a+[A]a",
        name: "Elephant",
        notation: "E-",
        sprite: "elephant",
        symbol: "E"
      },
      {
        description: "The Cannon is a hopping piece that moves sideways and vertically as many spaces as it wants, but it must hop over another piece to capture.",
        move: "[R]Bb[0 1 1 -1]Bab+[R]Bae",
        name: "Cannon",
        notation: "C-",
        sprite: "cannon",
        symbol: "C"
      },
      {
        description: "The Advisor is a leaping piece that moves one step in any direction.",
        move: "[K]a",
        name: "Advisor",
        notation: "A-",
        sprite: "pasha",
        symbol: "A"
      },
      {
        attributes: [ PieceAttributes.royal ],
        description: "The General is a leaping piece that moves one step in any direction. Can be checked and checkmated.",
        move: "[K]a",
        name: "General",
        notation: "G-",
        sprite: "king",
        symbol: "G"
      }
    ],
    author: "skyhistory",
    code: "sano",
    copy: "rotate",
    description: "Saño is a chess variant based on xiangqi and played on an 8x8 board. The captured pieces can be dropped into the first six ranks.",
    drop_to_zone: { black: "black_ranks_6", white: "white_ranks_6" },
    has_hand: true,
    height: 8,
    name: "Saño",
    setup: "bR bH bE bA bG bE bH bR 1. bC 4. bC 1.  2bs 1. 2bs 1. 2bs",
    width: 8,
    wins: [ Wins.royal_capture_n, Wins.stalemate ],
    style: "uncheckered",
  }