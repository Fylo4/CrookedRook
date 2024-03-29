import { Wins, PieceAttributes } from "../../TCR_Core/Constants";

export const ccit_kitchen = {
    name: "Kitchen",
    author: "qBlaine",
	style: "checkered",
	width: 8,
    height: 8,
    wins: [Wins.stalemate, Wins.bare_royal],

    all_pieces: [
        {
            name: "Peasant",
            description: "Moves passively forward one step, captures one step forward-diagonally, and promotes when reaching the back rank",
            sprite: "peasant",
            symbol: "1",
            notation: "",
            move: "[S]ae+[P]ca",
            attributes: [PieceAttributes.ep_capturer],
            promotions: [{ to: ["Q"] }],
        },
        {
            name: "Pawn",
            description: "Moves passively forward one step (or 2 on its first move), captures one step forward-diagonally, and promotes when reaching the back rank",
            sprite: "pawn",
            symbol: "2",
            notation: "",
            move: "i[0 1 1 2]Bae+[S]ae+[P]ca",
            promotions: [{ to: ["Q"] }],
            attributes: [PieceAttributes.ep_captured, PieceAttributes.ep_capturer],
        },
        {
            name: "Knight",
            description: "Jumps in a (2, 1) L-shaped pattern",
            sprite: "knight",
            symbol: "N",
            move: "[N]a",
        },
        {
            name: "Queen",
            description: "Moves like a Rook or Bishop",
            sprite: "queen",
            symbol: "Q",
            move: "[Q]Ba",
        },
        {
            name: "Kay",
            description: "Acts like a king but can't castle and can't be checked. Can double move like a pawn.",
            sprite: "commoner",
            symbol: "K",
            move: "[K]a+i[0 1 1 2]Bae",
            attributes: [PieceAttributes.royal, PieceAttributes.castle_from],
        },
        {
            name: "Beholder",
            description: "Within a 7x7 box, attacks any square with the same colour it is on. Cannot move passively.",
            sprite: "beholder",
            symbol: "B",
            move: "([F],[D],[A],[C],[G])ab",
        },
	],
    setup: "bB bN b2 2bK b2 bN bB 8b1",
    copy: "flip",
}