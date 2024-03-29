import { PieceAttributes } from "../../TCR_Core/Constants";

export const ccit_segiztas_peak = {
    name: "Segiztas Peak",
    description: "Above Sekirgishqulaq Fields there's a mountain called Segiztas. It's peak is full of rare minerals that two kingdoms fought, fight, and will fight for. And so they fight again. This time there are no unique tiles.",
	style: "checkered",
	width: 6,
	height: 6,

	all_pieces: [
		{
            name: "Rook",
            description: "Moves sideways and vertically as many spaces as it wants",
            sprite: "rook",
			symbol: "R",
			move: "[R]Ba",
        },
        {
            name: "Ferz-King",
            description: "Acts like a Ferz. A Royale piece. Couldn't come up with any good flavor text.",
            sprite: "sultan",
            symbol: "F",
            move: "[F]a",
            attributes: [PieceAttributes.royal],
        },
        {
            name: "Wazir-King",
            description: "Acts like Wazir. A Royale piece. Likes cats.",
            sprite: "overlord",
            symbol: "W",
            move: "[W]a",
            attributes: [PieceAttributes.royal],
        },
        {
            name: "Cannon",
            description: "Can canon cannon can can- can on a can ? Moves and captures like a rook.Have to jump over a pieces to capture.",
            sprite: "cannon",
            symbol: "C",
            move: "[R]Bb[0 1 1 -1]Bab+[R]Bae",
        },
        {
            name: "Spear Thrower",
            description: "Who needs cannon when all you need is a well aimed spear? Acts like a Bishop, but requires a piece to jump over. Additionally can move like a king.",
            sprite: "spear",
            symbol: "S",
            move: "[B]Bb[0 1 1 -1]Bab+[B]Bae+[K]ae",
        },
        {
            name: "Boulder",
            description: "Moves like a king. Cannot attack. Cannot be attacked.",
            sprite: "circle",
            symbol: "B",
            move: "[K]ae",
            attributes: [PieceAttributes.iron],
        },
	],
    setup: "bS bF bC bR bW bS bB 4. bB 2. 2wB",
    copy: "flip",
}