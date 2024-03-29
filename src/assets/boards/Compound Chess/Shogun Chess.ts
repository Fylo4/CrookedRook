import { Wins, Events, PieceAttributes } from "../../TCR_Core/Constants";

export const compound_shogun = {
    name: "Shogun Chess",
    author: "Couch Tomato",
    description: "Chess with additional compound pieces. Promotion zone is last 3 ranks. Bishop and Rook promote to gain the Knight's abilities (Archbishop and Mortar), Knight and Pawn gains the King's abilities (General and Captain), and Duchess gains the Queen's abilities. Pieces are un-promoted on capture, with the Queen un-promoting to Duchess. Pieces can be dropped to the first 5 ranks. Only one of each Queen, Mortar, Archbishop, and General are allowed per side. This rule is not implemented: 'Pawns cannot promote if capturing by en passant'.",
	style: "checkered",
	width: 8,
	height: 8,
	wins: [Wins.royal_capture_n],
	draws: [Wins.stalemate],
    castle_length: 2,
	drop_to_zone: {white: 5, black: 4},
	has_hand: true,

	all_pieces: [
		{
			name: "Pawn",
			description: "Moves passively forward one step (or 2 on its first move), captures one step forward-diagonally, and promotes when reaching the back rank",
            sprite: "pawn",
            symbol: "p",
            notation: "",
			move: "z{2 3}[0 1 1 2]Bae+[S]ae+[P]ca",
            promotions: [{ white: 1, black: 0, to: ["p", "C"], on: [Events.enter, Events.exit, Events.between] }],
            attributes: [PieceAttributes.ep_captured, PieceAttributes.ep_capturer],
		},
		{
            name: "Rook",
            description: "Moves sideways and vertically as many spaces as it wants",
            sprite: "rook",
			symbol: "R",
			move: "[R]Ba",
            promotions: [{ white: 1, black: 0, to: ["R", "M"], on: [Events.enter, Events.exit, Events.between] }],
			attributes: [PieceAttributes.castle_to],
		},
		{
            name: "Knight",
            description: "Jumps in a (2, 1) L-shaped pattern",
            sprite: "knight",
			symbol: "N",
			move: "[N]a",
            promotions: [{ white: 1, black: 0, to: ["K", "G"], on: [Events.enter, Events.exit, Events.between] }],
		},
		{
            name: "Bishop",
            description: "Moves diagonally as many spaces as it wants",
            sprite: "bishop",
			symbol: "B",
			move: "[B]Ba",
            promotions: [{ white: 1, black: 0, to: ["B", "A"], on: [Events.enter, Events.exit, Events.between] }],
		},
		{
            name: "Duchess",
            description: "Un-promoted Queen. Moves one step diagonally, like Ferz.",
            sprite: "prince",
			symbol: "D",
            move: "[F]a",
			promotions: [{white: 1, black: 0, to: ["D", "Q"], on: [Events.enter, Events.exit, Events.between]}]
		},
		{
            name: "King",
            description: "Moves one step in any direction. Can be checked and checkmated.",
            sprite: "king",
			symbol: "K",
            move: "[K]a+i[1 0 2 -1]BemP{Rook}",
			attributes: [PieceAttributes.royal, PieceAttributes.castle_from],
		},
		{
            name: "Queen",
            description: "Moves like a Rook or Bishop",
            sprite: "queen",
			symbol: "Q",
			move: "[Q]Ba",
			attributes: [PieceAttributes.transform_on_death],
			held_piece: "D",
			limit: 1
		},
		{
            name: "Mortar",
            description: "Knight + Rook",
            sprite: "chancellor",
			symbol: "M",
            move: "([N],[R])Ba",
			attributes: [PieceAttributes.transform_on_death],
			held_piece: "R",
			limit: 1
		},
		{
            name: "Archbishop",
            description: "Knight + Bishop",
            sprite: "archbishop",
			symbol: "A",
            move: "([N],[B])Ba",
			attributes: [PieceAttributes.transform_on_death],
			held_piece: "B",
			limit: 1
		},
		{
            name: "General",
            description: "Knight + non-royal King",
            sprite: "centaur_king",
			symbol: "G",
            move: "([N],[K])Ba",
			attributes: [PieceAttributes.transform_on_death],
			held_piece: "N",
			limit: 1
		},
		{
            name: "Captain",
            description: "non-royal King",
            sprite: "commoner",
			symbol: "C",
            move: "[K]a",
			attributes: [PieceAttributes.transform_on_death],
			held_piece: "p"
		},
	],
    setup: "bR bN bB bQ bK bB bN bR 8bp",
    copy: "flip",
	zones: [
		"00000000 00000000 00000000 00000000 00000000 11111111 11111111 11111111",
		"11111111 11111111 11111111 00000000 00000000 00000000 00000000 00000000",
		"00000000 00000000 00000000 00000000 00000000 00000000 11111111 00000000",
		"00000000 11111111 00000000 00000000 00000000 00000000 00000000 00000000",
		"11111111 11111111 11111111 11111111 11111111 00000000 00000000 00000000",
		"00000000 00000000 00000000 11111111 11111111 11111111 11111111 11111111",
	]
}