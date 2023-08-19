import { Wins, PieceAttributes } from "../../TCR_Core/Constants";

export const shogi_micro = {
    name: "Micro Shogi",
    description: "Small version of Shogi. Pieces promote/demote when capturing: Pawn <=> Knight, Gold <=> Rook, Bishop <=> Tokin, and Silver <=> Lance.",
    style: "uncheckered",
	width: 4,
	height: 5,
	has_hand: true,
	wins: [Wins.royal_capture_n, Wins.stalemate],

	all_pieces: [
		{
			name: "Pawn",
			description: "Moves and captures forward one step.",
            sprite: "kasa_peasant",
            mini_sprite: "knight",
            symbol: "p",
            notation: "",
			move: "[S]a",
            attributes: [PieceAttributes.promote_on_attack],
            held_piece: "N"
		},
		{
            name: "Rook",
            description: "Moves sideways and vertically as many spaces as it wants",
            sprite: "rook",
            mini_sprite: "hidetchi_gold",
			symbol: "R",
            move: "[R]Ba",
            attributes: [PieceAttributes.promote_on_attack],
            held_piece: "G"
        },
        {
            name: "Bishop",
            description: "Moves diagonally as many spaces as it wants",
            sprite: "bishop",
            mini_sprite: "hidetchi_gold",
            symbol: "B",
            move: "[B]Ba",
            attributes: [PieceAttributes.promote_on_attack],
            held_piece: "T"
        },
        {
            name: "Lance",
            description: "Moves up as many spaces as it wants",
            sprite: "spear",
            mini_sprite: "hidetchi_silver",
            symbol: "L",
            move: "[L]Ba",
            attributes: [PieceAttributes.promote_on_attack],
            held_piece: "S"
        },
		{
            name: "Knight",
            description: "Japanese Knight. Jumps forward two spaces and sideways one. Promotes to Gold.",
            sprite: "knight",
            mini_sprite: "peasant",
			symbol: "N",
            move: "[JN]a",
            attributes: [PieceAttributes.promote_on_attack],
            held_piece: "p"
        },
        {
            name: "Silver",
            description: "Moves one step diagonally or forward. Promotes to Gold.",
            sprite: "hidetchi_silver",
            mini_sprite: "spear",
            symbol: "S",
            move: "[Si]a",
            attributes: [PieceAttributes.promote_on_attack],
            held_piece: "L"
        },
        {
            name: "Gold",
            description: "Moves one step cardinally or forward-diagonal.",
            sprite: "hidetchi_gold",
            mini_sprite: "rook",
            symbol: "G",
            move: "[Go]a",
            attributes: [PieceAttributes.promote_on_attack],
            held_piece: "R"
        },
		{
            name: "King",
            description: "Moves one step in any direction. Can be checked and checkmated.",
            sprite: "king",
			symbol: "K",
			move: "[K]a",
            attributes: [PieceAttributes.royal]
        },
        {
            name: "Tokin",
            description: "Moves as a Gold.",
            sprite: "hidetchi_gold",
            mini_sprite: "bishop",
            symbol: "T",
            move: "[Go]a",
            attributes: [PieceAttributes.promote_on_attack],
            held_piece: "B"
        },
	],
    setup: "bK bB bG bS bp",
    copy: "rotate",
    starting_hands: {white: [], black: []}
}