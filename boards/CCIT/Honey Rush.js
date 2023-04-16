preset_variants[folders.ccit].push({
    name: "Honey Rush",
    author: "SamG_007",
    description: "A 9x6 board featuring the Bear. There are the King, the Pawn, the Bishop Switch (can change its square color by moving one step forward), the Rook (can't castle), the Bear, the Honey Bowl, the Snake (it's different from the default chesscraft Snake), and the Bomber. Some tips for this board: Keep a solid pawn structure, and don't move the Honey Bowls too early. It's better to promote the pawn-type units only in the endgame. Don't sacrifice too early important pieces, like the Bear and the Snake, and always keep an eye on the enemy Bombers' trajectory. Have fun :)\nNOTE: Restrictors aren't yet implemented in The Crooked Rook.",
    width: 6,
	height: 9,

    all_pieces: [
        {
            name: "Bishop Switch",
            description: "Bishop but it can switch color square by making one step forward. Attacking remains the same as normal Bishop.",
            sprite: "bishop",
            symbol: "B",
            notation: "BS",
            move: "[B]Ba+[S]ae",
        },
        {
            name: "Bomber",
            description: "Attacks from distance like a bishop and doesn't move. Can castle like a rook.",
            sprite: "cannon",
            symbol: "O",
            notation: "BM",
            move: "[B]Bab",
            attributes: [attrib.enemy_static, attrib.castle_to],
        },
        {
            name: "Honey Bowl",
            description: "Acts like a bear sideways forward. Promotes to bear.",
            sprite: "cauldron",
            symbol: "H",
            promotions: [{ white: 2, black: 1, to: ["E"], on: [events.enter] }],
            move: "([2 1 1 1],[-2 1 1 1],[3 1 1 1],[-3 1 1 1])a",
        },
        {
            name: "Bear",
            description: "Knight + Giraffe",
            sprite: "bear",
            symbol: "E",
            notation: "BR",
            move: "([N],[C])a",
        },
        {
            name: "Rook",
            description: "A normal rook, but without the ability to castle.",
            sprite: "rook",
            symbol: "R",
            move: "[R]Ba",
        },
        {
            name: "Snake",
            description: "It's different from the default chesscraft piece \"snake\". It moves by 2 in every direction, but it can't capture. Nearby enemy pieces can't move at all.",
            sprite: "snake",
            symbol: "S",
            move: "[0 1 8 2]Bae",
            attributes: ["glue_curse", "peace_curse"],
            held_move: "[K]"
        },
        {
            name: "Pawn",
            description: "Moves passively forward one step (or 2 on its first move), captures one step forward-diagonally, and promotes when reaching the back rank",
            sprite: "pawn",
            symbol: "p",
            notation: "",
            move: "i[0 1 1 2]Bae+[S]ae+[P]ca",
            promotions: [{ white: 0, black: 0, to: ["B", "O", "R", "S"], on: [events.enter] }],
            attributes: [attrib.ep_captured, attrib.ep_capturer],
        },
        {
            name: "King",
            description: "Moves one step in any direction. Can be checked and checkmated.",
            sprite: "king",
            symbol: "K",
            move: "[K]a+i[1 0 2 -1]BemP{Bomber}",
            attributes: [attrib.royal, attrib.castle_from],
        },
	],
    setup: "bO bS bR bK bB bO bE 4bH bE 6bp",
    copy: "flip",
	zones: [
        "000000 111111 000000 000000 000000 000000 000000 111111 000000",
        "000000 000000 000000 000000 000000 000000 111111 000000 000000",
        "000000 000000 111111 000000 000000 000000 000000 000000 000000",
	],
});