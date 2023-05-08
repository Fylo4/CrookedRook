let last_loaded_board;
let loaded_from_file = false;
function start_game(json_data, seed, from_file) {
    if(seed === undefined) {
        seed = cyrb128(time_as_string())[0];
    }
    let rand = mulberry32(seed);
    last_loaded_board = JSON.parse(JSON.stringify(json_data));
    loaded_from_file = !!from_file;

    //Init game data from game data seed
    game_data = game_data_from_object(json_data);
    game_data.seed = seed;
    inflate_game_data(game_data);
    validate_game_data(game_data);
    set_mols_and_moves();
    
    //Init board from game data
    board = get_empty_board(game_data);
    fill_board(rand);
    
    //Website stuff from here down
    temp_data = {
        selected: false,
        selected_position: -1,
        mouse_pressed: false, //Not needed?
        waiting_for_promotion: false,
        promotions: [],
        move_to: -1,
        hand_selected: false,
        selected_side: false
    }

    //Load all piece sprites
    let piece_sprites = game_data.all_pieces.map(e => e.sprite);
    piece_sprites.push(...game_data.all_pieces.filter(e => e.mini_sprite).map(e => e.mini_sprite));
    add_pieces_then_reload(piece_sprites);
    //Style data
    if (game_data.flip_colors) { style_data.flip_colors = true; }
    circles = [];
    lines = [];
    if (game_data.style) {
        style_data.style = game_data.style;
        document.getElementById("style_select").value = game_data.style;
    }

    fix_canvas_height();
    refresh_moves();
    move_history = [];
    board_history = [cloneBoard()];
    view_move = 0;
    render_extras();
    render_entire_board();
}

function game_data_from_object(input) {
    let gd = {};

    //Copy values
    gd.name = input.name ?? input.n ?? show_error("Board must have a name");
    gd.author = input.author ?? input.a ?? "";
    gd.description = input.description ?? input.i ?? "";
    gd.width = input.width ?? input.x ?? show_error("Board must have a width");
    gd.height = input.height ?? input.x ?? show_error("Board must have a height");
    gd.turn_list = input.turn_list ?? input.t ?? [false, true];
    gd.flip_colors = input.flip_colors ?? input.fc ?? false;
    gd.castle_length = input.castle_length ?? input.c ?? 2;
    gd.wins = input.wins ?? input.w ?? [ends.royal_capture];
    gd.draws = input.draws ?? input.d ?? [ends.stalemate];
    gd.has_hand = input.has_hand ?? input.hh ?? false;
    gd.starting_hands = input.starting_hands ?? input.sh ?? {white: [], black: []};
    gd.drop_to_zone = input.drop_to_zone ?? input.dz ?? undefined;
    gd.all_pieces = input.all_pieces ?? input.p ?? show_error("Board must have piece data");
    gd.active_squares = input.active_squares ?? input.as ?? new squareset(gd.width*gd.height, 1);
    gd.setup = input.setup ?? input.s ?? show_error("Board must have setup string");
    gd.copy = input.copy ?? input.cp ?? "";
    gd.zones = input.zones ?? input.z ?? [];
    gd.fischer_zones = input.fischer_zones ?? input.fz ?? [];
    gd.mud = input.mud ?? input.ms ?? new squareset(gd.width*gd.height);
    gd.ethereal = input.ethereal ?? input.es ?? new squareset(gd.width*gd.height);
    gd.pacifist = input.pacifist ?? input.ps ?? new squareset(gd.width*gd.height);
    gd.sanctuary = input.sanctuary ?? input.ss ?? new squareset(gd.width*gd.height);
    gd.highlight = input.highlight ?? input.h ?? new squareset(gd.width*gd.height);
    gd.highlight2 = input.highlight2 ?? input.h2 ?? new squareset(gd.width*gd.height);
    gd.snap_mode = input.snap_mode ?? input.sm ?? "clockwise";
    gd.force_drop = input.force_drop ?? input.fd ?? false;
    gd.destroy_on_burn = input.destroy_on_burn ?? input.db ?? false;
    gd.destroy_on_capture = input.destroy_on_capture ?? input.dc ?? false;
    gd.berzerk = input.berzerk ?? input.b ?? false;
    gd.style = input.style ?? input.st ?? "checkered";
    gd.precompute = false;
    gd.has_copy_attrib = false;

    return gd;
}

//No return
function inflate_game_data(input) {
    if (input.copy === "f") { input.copy = "flip"; }
    if (input.copy === "r") { input.copy = "rotate"; }
    
    //Zoneify zones
    for (let a = 0; a < input.zones.length; a ++) {
        input.zones[a] = zone_to_squareset(input.zones[a]);
    }
    for (let a = 0; a < input.fischer_zones.length; a ++) {
        input.fischer_zones[a] = get_zone_and_push(input.fischer_zones[a]);
    }
    if (input.drop_to_zone != undefined && input.drop_to_zone.white != undefined && input.drop_to_zone.black != undefined) {
        input.drop_to_zone.white = get_zone_and_push(input.drop_to_zone.white);
        input.drop_to_zone.black = get_zone_and_push(input.drop_to_zone.black);
    }
    input.active_squares = zone_to_squareset(input.active_squares);
    input.mud = zone_to_squareset(input.mud);
    input.ethereal = zone_to_squareset(input.ethereal);
    input.pacifist = zone_to_squareset(input.pacifist);
    input.sanctuary = zone_to_squareset(input.sanctuary);
    input.highlight = zone_to_squareset(input.highlight);
    input.highlight2 = zone_to_squareset(input.highlight2);

    //Initialize utility squaresets
    if (game_data.precompute) {
        let bnb_ep = bnb_ep_squaresets(input.width, input.height, input.active_squares);
        input.bnb_ss = bnb_ep.bnb_ss;
        input.ep_ss = bnb_ep.ep_ss;
    }
    else {
        input.bnb_ss = [];
        input.ep_ss = [];
    }
    

    //Magic numbers
    to_magic_numbers(input.wins, ends_str, "Win condition");
    to_magic_numbers(input.draws, ends_str, "Draw condition");
    if (input.wins.includes(ends.stalemate) && input.draws.includes(ends.stalemate)) {
        input.draws.splice(input.draws.indexOf(ends.stalemate), 1);
    }

    //Inflate objects
    input.all_pieces = inflate_pieces(input.all_pieces);
    input.starting_hands = inflate_hands(input.starting_hands, input.all_pieces);
    input.turn_list = inflate_turn_list(input.turn_list);

    //See if we have any copy_attribs
    for (let a = 0; a < input.all_pieces.length; a ++) {
        if (input.all_pieces[a].attributes.includes(attrib.copy_attrib)) {
            input.has_copy_attrib = true;
            break;
        }
    }

    //Make sure attributes are arrays if needed
    if (!Array.isArray(input.wins)) { input.wins = [input.wins]; }

    //Boolify bools
    input.flip_colors = !!input.flip_colors;
    input.has_hand = !!input.has_hand;
    input.force_drop = !!input.force_drop;
    input.destroy_on_burn = !!input.destroy_on_burn;
    input.destroy_on_capture = !!input.destroy_on_capture;
    input.berzerk = !!input.berzerk;
}

//No return
function validate_game_data(input) {
    if (input.snap_mode && !["clockwise", "counterclockwise", "orthogonal", "diagonal"].includes(input.snap_mode)) {
        show_error("Snap mode not found: "+input.snap_mode);
    }
    if (!["", "flip", "rotate"].includes(input.copy)) {
        show_error("Copy type not found: "+input.copy);
    }
    for (let a = 0; a < input.all_pieces.length; a ++) {
        let p = input.all_pieces[a];
        //There is no expected default behavior for held pieces. They must always be defined.
        if (p.held_piece === undefined) {
            if (get_attributes(p).includes(attrib.spawn_constant) || 
                get_attributes(p).includes(attrib.spawn_on_death) ||
                get_attributes(p).includes(attrib.spawn_trail)) {
                show_error(`Piece ${p.name} has a spawn attribute but no held piece`);
            }
            if (get_attributes(p).includes(attrib.transform_on_death)) {
                show_error(`Piece ${p.name} has transform on death attribute but no held piece`);
            }
        }
    }
}

//Takes in a hands data object, returns a fixed hands object
function inflate_hands(hands, pieces) {
    let ret = JSON.parse(JSON.stringify(hands));
    if (ret === undefined) { ret = { white: [], black: [] }; }
    //Name-based hand filling
    else if (typeof(ret.white[0]) === "string" || typeof(ret.black[0]) === "string") {
        let new_white = [], new_black = [];
        for (let a = 0; a < pieces.length; a++) {
            new_white.push(0);
            new_black.push(0);
        }
        for (let a = 0; a < ret.white.length; a++) {
            let id = name_to_piece_id(ret.white[a], pieces);
            if (id >= 0) {
                new_white[id]++;
            }
        }
        for (let a = 0; a < ret.black.length; a++) {
            let id = name_to_piece_id(ret.black[a], pieces);
            if (id >= 0) {
                new_black[id]++;
            }
        }
        ret = { white: new_white, black: new_black };
    }
    //Make sure all pieces have a hand index
    for (let a = ret.white.length; a < game_data.all_pieces.length; a++) {
        ret.white.push(0);
    }
    for (let a = ret.black.length; a < game_data.all_pieces.length; a++) {
        ret.black.push(0);
    }
    return ret;
}

function inflate_turn_list(turn_list) {
    let ret = JSON.parse(JSON.stringify(turn_list));
    for (let a = 0; a < ret.length; a ++) {
        if (typeof(ret[a]) === "string") {
            let word = ret[a].toLowerCase()
            if (word === "w" || word === "white") {
                ret[a] = false;
            }
            if (word === "b" || word === "black") {
                ret[a] = true;
            }
        }
        ret[a] = !!ret[a];
    }
    return ret;
}

function inflate_pieces(piece_list) {
    let ret = JSON.parse(JSON.stringify(piece_list));
    for (let a = 0; a < ret.length; a++) {
        let piece = ret[a];
        piece.name = piece.name ?? piece.n ?? show_error("All pieces must be named");
        piece.description = piece.description ?? piece.d ?? "";
        piece.sprite = piece.sprite ?? piece.i ?? show_error("All pieces must have a sprite");
        piece.angle = piece.angle ?? piece.r ?? undefined;
        piece.symbol = piece.symbol ?? piece.s ?? show_error("All pieces must have symbols");
        piece.notation = piece.notation ?? piece.w ?? undefined;
        piece.move = piece.move ?? piece.m ?? show_error("All pieces must have moves");
        piece.move_str = piece.move;
        piece.attributes = piece.attributes ?? piece.a ?? [];
        piece.promotions = piece.promotions ?? piece.p ?? [];
        piece.drop_to_zone = piece.drop_to_zone ?? piece.z ?? undefined;
        piece.limit = piece.limit ?? piece.l ?? undefined;
        piece.file_limit = piece.file_limit ?? piece.f ?? undefined;
        piece.held_piece = piece.held_piece ?? piece.hp ?? undefined;
        piece.held_move = piece.held_move ?? piece.hm ?? undefined;
        piece.flip_sprite = piece.flip_sprite ?? piece.fs ?? false;
        
        if (piece.sprite === "cerebus") { piece.sprite = "cerberus"; }

        if (!Array.isArray(piece.attributes)) { piece.attributes = [piece.attributes] }
        to_magic_numbers(piece.attributes, attrib_str, "Piece attribute");
        if (piece.drop_to_zone != undefined) {
            piece.drop_to_zone.white = get_zone_and_push(piece.drop_to_zone.white);
            piece.drop_to_zone.black = get_zone_and_push(piece.drop_to_zone.black);
        }

        //Process promotions (promote to is processed more later)
        if (!Array.isArray(piece.promotions)) { piece.promotions = [piece.promotions]; }
        for(let b = 0; b < piece.promotions.length; b ++) {
            piece.promotions[b].white = piece.promotions[b].white ?? piece.promotions[b].w ?? "black_rank_1";
            piece.promotions[b].black = piece.promotions[b].black ?? piece.promotions[b].b ?? "white_rank_1";
            piece.promotions[b].on = piece.promotions[b].on ?? piece.promotions[b].o ?? [events.enter];
            piece.promotions[b].to = piece.promotions[b].to ?? piece.promotions[b].t ?? show_error(`You must specify what ${piece.name} promotes to`);

            piece.promotions[b].white = get_zone_and_push(piece.promotions[b].white);
            piece.promotions[b].black = get_zone_and_push(piece.promotions[b].black);
            if (!Array.isArray(piece.promotions[b].on)) { piece.promotions[b].on = [piece.promotions[b].on]; }
            to_magic_numbers(piece.promotions[b].on, events_str, "Piece promotion event");
            if (!Array.isArray(piece.promotions[b].to)) { piece.promotions[b].to = [piece.promotions[b].to]; }
        }

        //Most of the time held move will probably be [K], so just set it by default if needed
        if (piece.held_move === undefined) {
            let attributes_that_require_hm = [
                attrib.glue_curse, attrib.peace_curse, attrib.ghost_curse, attrib.mud_curse,
                attrib.burn_peaceful, attrib.burn_passive, attrib.burn_attack, attrib.burn_death,
                attrib.iron_bless,
                attrib.spawn_constant, attrib.spawn_on_death, attrib.spawn_trail,
            ];
            for (let b = 0; b < attributes_that_require_hm.length; b++) {
                if (get_attributes(piece).includes(attributes_that_require_hm[b])) {
                    piece.held_move = "[K]";
                    break;
                }
            }
        }
    }
    //Everything below this needs the piece array to be fully processed first
    //Held pieces - string to id
    for (let a = 0; a < ret.length; a++) {
        ret[a].held_piece = name_to_piece_id(ret[a].held_piece, ret);
    }
    //Piece promotions - string to id
    for (let p = 0; p < ret.length; p++) {
        let piece = ret[p];
        for (let a = 0; a < piece.promotions.length; a++) {
            let new_to = [];
            for (let b = 0; b < piece.promotions[a].to.length; b++) {
                let tob = piece.promotions[a].to[b];
                if (tob === "NSNR" || tob === "NRNS") { //Non-self non-royal
                    for (let c = 0; c < ret.length; c++) {
                        if (c != p && !get_attributes(ret[c]).includes(attrib.royal)) {
                            new_to.push(c);
                        }
                    }
                    continue;
                }
                else {
                    let id = name_to_piece_id(tob, ret);
                    if (id >= 0) {
                        new_to.push(id);
                    }
                }
            }
            piece.promotions[a].to = new_to;
        }
    }

    return ret;
}

function get_empty_board(gd) {
    let size = gd.width * gd.height;
    return {
        turn_pos: 0,
        turn: gd.turn_list[0],
        turn_count: 1,
        last_moved_src: -1,
        last_moved_dest: -1,
        last_moved_col: false,

        is_piece_locked: false,
        promotion_locked: false,
        piece_locked_pos: -1,

        piece_ss: [],
        white_ss: new squareset(size),
        black_ss: new squareset(size),
        solid_ss: new squareset(size),
        iron_ss: new squareset(size),
        tall_ss: new squareset(size),
        royal_ss: new squareset(size),
        passive_burn_ss: new squareset(size),
        burn_immune_ss: new squareset(size),
        constant_spawn_ss: new squareset(size),

        can_move_ss: [],
        can_drop_piece_to: {white: [], black: []},
        can_drop: {white: false, black: false},
        has_moved_ss: new squareset(size),
        has_attacked_ss: new squareset(size),
        ep_mask: new squareset(size),
        checked: {black: new squareset(size), white: new squareset(size)},

        copycat_memory: -1, //piece id
        hands: JSON.parse(JSON.stringify(gd.starting_hands)),

        royals_killed: { white: 0, black: 0 },
        victory: -1, //0 - White, 0.5 - Draw, 1 - Black, -1 - Undefined
        white_attack_ss: new squareset(size),
        black_attack_ss: new squareset(size),
    };
}

//Reads and writes directly from/to game_data and board
function fill_board(rand) {
    let size = game_data.width * game_data.height;
    for (let a = 0; a < game_data.all_pieces.length; a++) {
        board.piece_ss.push(new squareset(size));
    }
    for (let a = 0; a < size; a++) {
        board.can_move_ss.push(new squareset(size));
    }
    //Read piece string and place pieces
    for (let a = 0, pos = 0; a < game_data.setup.length; a++) {
        let char = game_data.setup[a];
        if (["b", "w", "n"].includes(char.toLowerCase())) {
            let col = char.toLowerCase();
            a++;
            let piece = game_data.all_pieces.indexOf(game_data.all_pieces.find(piece => piece.symbol === game_data.setup[a]));
            if (piece === -1) {
                continue;
            }
            set_piece_space(piece, col, pos, rand, true);
            pos++;
        }
        else if (char === ".") {
            pos++;
        }
        else if (char<="9" && char>="0") {
            //Find the whole number
            let num = parseInt(char);
            a++;
            while (game_data.setup[a]<="9" && game_data.setup[a]>="0") {
                num *= 10;
                num += parseInt(game_data.setup[a]);
                a++;
            }
            //Find the next char - should be b, w, n, or .
            if (game_data.setup[a] === ".") {
                pos += num;
            } else if (["b", "w", "n"].includes(game_data.setup[a].toLowerCase())) {
                let col = game_data.setup[a].toLowerCase();
                a++;
                let piece = game_data.all_pieces.indexOf(game_data.all_pieces.find(piece => piece.symbol === game_data.setup[a]));
                if (piece === -1) {
                    continue;
                }
                for (let b = 0; b < num; b++) {
                    set_piece_space(piece, col, pos, rand, true);
                    pos++;
                }
            }
        }
    }
    //Flip or rotate the board
    if (game_data.copy === "flip" || game_data.copy === "rotate") {
        let placed_pieces = ss_or(board.white_ss, board.black_ss);
        for (; !placed_pieces.is_zero(); placed_pieces.pop()) {
            let sq_orig = placed_pieces.get_ls1b();
            let sq = game_data.width * game_data.height - sq_orig - 1;
            if (game_data.copy === "flip") {
                sq = (game_data.height - Math.floor(sq_orig / game_data.width) - 1) * game_data.width + (sq_orig % game_data.width);
            }
            if (!board.black_ss.get(sq) && !board.white_ss.get(sq)) {
                let col = (board.black_ss.get(sq_orig) && board.white_ss.get(sq_orig)) ? "n" :
                    board.black_ss.get(sq_orig) ? "w" : "b";
                set_piece_space(identify_piece(sq_orig), col, sq, rand);
            }
        }
    }
}

function set_mols_and_moves() {
    let all_molecules = [];
    //Set all piece's moves, and update all_molecules
    for (let a = 0; a < game_data.all_pieces.length; a++) {
        //console.log(game_data.all_pieces[a].name);
        game_data.all_pieces[a].move = string_to_move(game_data.all_pieces[a].move, all_molecules);
    }
    //Set move ss
    game_data.move_ss = [];
    if (game_data.precompute) {
        for (let a = 0; a < all_molecules.length; a++) {
            game_data.move_ss.push(generate_move_ss(all_molecules[a]));
        }
    }
    //Update molecules for held moves
    for (let a = 0; a < game_data.all_pieces.length; a++) {
        let piece = game_data.all_pieces[a];
        if (game_data.precompute && piece.held_move && typeof(piece.held_move) === "string") {
            //If we pre-compute, turn it into an array index
            //Otherwise just keep it as a string
            piece.held_move = string_to_mol_num(piece.held_move, all_molecules);
        }
    }
}

//chars is array of characters
function string_only_has_chars(string, chars) {
    if (typeof(string) !== "string") {
        return false;
    }
    for (let a = 0; a < string.length; a ++) {
        if (!chars.includes(string[a])) {
            return false;
        }
    }
    return true;
}

function zone_to_squareset(zone) {
    if (typeof(zone) === "number" && game_data.zones.length > zone) {
        return game_data.zones[zone];
    }
    else if (typeof(zone) === "string" && !isNaN(zone) && zone.length < 3 && game_data.zones.length > Number(zone)) {
        //Max 2 digits to prevent "000111000" to be read as a number
        return game_data.zones[Number(zone)];
    }
    else if (string_only_has_chars(zone, ["0", "1", " "])) {
        return squareset_from_string(game_data.width*game_data.height, zone);
    }
    else if (typeof(zone) === "string") {
        let zone_ss = new squareset(game_data.width*game_data.height);
        if (zone.startsWith("white_ranks_")) {
            let number = Number(zone.substring(12));
            for (let a = 0; a < game_data.width*number; a ++) {
                zone_ss.set_on(game_data.width*game_data.height - 1 - a);
            }
        }
        else if (zone.startsWith("black_ranks_")) {
            let number = Number(zone.substring(12));
            for (let a = 0; a < game_data.width*number; a ++) {
                zone_ss.set_on(a);
            }
        }
        else if (zone.startsWith("white_rank_")) {
            let number = Number(zone.substring(11));
            for (let a = 0; a < game_data.width; a ++) {
                zone_ss.set_on(game_data.width*(game_data.height-number) + a);
            }
        }
        else if (zone.startsWith("black_rank_")) {
            let number = Number(zone.substring(11));
            for (let a = 0; a < game_data.width; a ++) {
                zone_ss.set_on(game_data.width*(number-1) + a);
            }
        }
        else if (zone === "white_palace") {
            let start_x = Math.floor((game_data.width-3)/2), start_y = game_data.height-3;
            for (let x = start_x; x < start_x+3; x ++) {
                for(let y = start_y; y < start_y+3; y ++) {
                    zone_ss.set_on(y*game_data.width+x);
                }
            }
        }
        else if (zone === "black_palace") {
            let start_x = Math.ceil((game_data.width-3)/2), start_y = 0;
            for (let x = start_x; x < start_x+3; x ++) {
                for(let y = start_y; y < start_y+3; y ++) {
                    zone_ss.set_on(y*game_data.width+x);
                }
            }
        }
        else if (zone === "all") {
            for (let a = 0; a < game_data.width*game_data.height; a ++) {
                zone_ss.set_on(a);
            }
        }
        else {
            show_error("Unknown zone: "+zone);
        }
        return zone_ss;
    }
    else if (Array.isArray(zone)) {
        let zone_ss = new squareset(game_data.width * game_data.height);
        zone_ss.backingArray = [...zone];
        return zone_ss;
    }
    else if(typeof(zone) === "object") {
        return zone; //Assume it's already a ss
    }
    else {
        show_error("Zone not recognized: "+zone)
        console.error("Zone not recognized: "+zone)
    }
}

function get_zone_and_push(zone, all_zones) {
    if (zone === undefined) {
        return;
    }
    if (all_zones === undefined) {
        all_zones = game_data.zones;
    }
    //Find the squareset corresponding to the zone
    zone_ss = zone_to_squareset(zone)
    //Now check to see if it is in all_zones
    for (let a = 0; a < all_zones.length; a ++) { 
        let is_equal = true;
        for (let b = 0; b < all_zones[a].backingArray.length; b ++) {
            if (zone_ss.backingArray[b] === undefined || all_zones[a].backingArray[b] !== zone_ss.backingArray[b]) {
                is_equal = false;
            }
        }
        if (is_equal) {
            return a;
        }
    }
    //At this point, we found no matches. Add it to the array
    all_zones.push(zone_ss);
    return all_zones.length-1;
}

function to_magic_numbers(arr, ref, str) {
    for (let a = 0; a < arr.length; a ++) {
        if (typeof (arr[a]) === "string") {
            let index = ref.indexOf(arr[a]);
            if (index === -1) {
                show_error(str+" not found: "+arr[a]);
            }
            else {
                arr[a] = index;
            }
        }
    }
}

//Converts id, name, or symbol to id
function name_to_piece_id(name, piece_list) {
    if (piece_list === undefined) {
        piece_list = game_data.all_pieces
    }
    if (typeof (name) === "number") {
        return name;
    }
    else if (typeof (name) === "string") {
        let num = piece_list.findIndex(e => e.name === name);
        if (num >= 0) {
            return num;
        }
        //Look for any pieces with symbol tob
        num = piece_list.findIndex(e => e.symbol === name);
        if (num >= 0) {
            return num;
        }
    }
    return -1;
}

function cloneBoard(brd) {
    if (brd === undefined) {
        brd = board;
    }
    let ret = JSON.parse(JSON.stringify(brd));
    Object.setPrototypeOf(ret.black_ss, squareset.prototype);
    Object.setPrototypeOf(ret.white_ss, squareset.prototype);
    Object.setPrototypeOf(ret.solid_ss, squareset.prototype);
    Object.setPrototypeOf(ret.ep_mask, squareset.prototype);
    Object.setPrototypeOf(ret.has_moved_ss, squareset.prototype);
    Object.setPrototypeOf(ret.has_attacked_ss, squareset.prototype);
    Object.setPrototypeOf(ret.iron_ss, squareset.prototype);
    Object.setPrototypeOf(ret.tall_ss, squareset.prototype);
    Object.setPrototypeOf(ret.royal_ss, squareset.prototype);
    Object.setPrototypeOf(ret.passive_burn_ss, squareset.prototype);
    Object.setPrototypeOf(ret.burn_immune_ss, squareset.prototype);
    Object.setPrototypeOf(ret.constant_spawn_ss, squareset.prototype);
    Object.setPrototypeOf(ret.black_attack_ss, squareset.prototype);
    Object.setPrototypeOf(ret.white_attack_ss, squareset.prototype);
    Object.setPrototypeOf(ret.checked.white, squareset.prototype);
    Object.setPrototypeOf(ret.checked.black, squareset.prototype);
    for (let a = 0; a < ret.can_move_ss.length; a++) {
        Object.setPrototypeOf(ret.can_move_ss[a], squareset.prototype);
    }
    for (let a = 0; a < ret.piece_ss.length; a++) {
        Object.setPrototypeOf(ret.piece_ss[a], squareset.prototype);
    }
    for (let a = 0; a < ret.can_drop_piece_to.white.length; a++) {
        Object.setPrototypeOf(ret.can_drop_piece_to.white[a], squareset.prototype);
        Object.setPrototypeOf(ret.can_drop_piece_to.black[a], squareset.prototype);
    }
    return ret;
}

//Process the entire move string
function string_to_move(string, mols) {
    let steps = string.split(">");
    let move = [];
    for (let a = 0; a < steps.length; a++) {
        move.push([]);
        let terms = steps[a].split("+");
        for (let b = 0; b < terms.length; b++) {
            let this_term = string_to_term(terms[b], mols);
            move[a].push(this_term);
        }
    }
    return move;
}

function string_to_mol_num(string, mols) {
    if (!mols.includes(string)) {
        mols.push(string);
        return mols.length - 1;
    }
    return mols.findIndex(e => e === string);
}

//Process a single component of the move string
function string_to_term(string, mols) {
    //Updates mols and returns term array
    let term = [];
    let repeat = -1; //Position in the term array where it loops to; -1 for no loop
    for (let a = 0; a < string.length; a++) {
        //Find molecules
        if (string[a] === "(" || string[a] === "[") {
            let end_char = (string[a] === "(") ? ")" : "]";
            let t_mol = "";
            while (a < string.length && string[a] != end_char) {
                t_mol += string[a];
                a++;
            }
            t_mol += end_char;
            if (!mols.includes(t_mol)) {
                mols.push(t_mol);
            }
            let data = game_data.precompute ? mols.findIndex(e => e === t_mol) : t_mol;
            term.push({ type: "mol", data });
        }
        else if (string[a] === "U") {
            if (!mols.includes("U")) {
                mols.push("U");
            }
            let data = game_data.precompute ? mols.findIndex(e => e === "U") : "U";
            term.push({ type: "mol", data });
        }
        //Pre-conditions
        //Data is break condition
        else if (string[a] === "T") {
            let num = get_1_num(string, a + 1);
            term.push({ type: "pre", data: () => { return (board.turn_count <= num.num); } });
            a = num.pos;
        }
        else if (string[a] === "t") {
            let num = get_1_num(string, a + 1);
            term.push({ type: "pre", data: () => { return (board.turn_count >= num.num); } });
            a = num.pos;
        }
        else if (string[a] === "i") { term.push({ type: "pre",
            data: (col, pos) => { return board.has_moved_ss.get(pos); } }); }
        else if (string[a] === "z") {
            let nums = get_2_zones(string, a + 1);
            term.push({type: "pre", data: (col, pos) => { return !game_data.zones[col ? nums.num2 : nums.num1].get(pos); } });
            a = nums.pos;
        }
        else if (string[a] === "r") {
            let piece_data = pieces_in_bracket(string, a + 1);
            term.push({ type: "pre", data: (col) => {
                for(let a = 0; a < piece_data.pieces.length; a ++) {
                    if(!slots_left(piece_data.pieces[a], col)) {
                        return true;
                    }
                }
                return false;
            }});
            a = piece_data.pos;
        }
        else if(string[a] === "u") {
            term.push({ type: "pre", data: (col, pos, id) => {
                return ss_and(col ? board.black_ss : board.white_ss, board.piece_ss[id]).count_bits() > 1;
            }})
        }
        else if(string[a] === "h") {
            term.push({ type: "pre", data: (col) => {
                if (!game_data.has_hand) {
                    return true;
                }
                let opp_hand = col ? board.hands.white : board.hands.black;
                for (let a = 0; a < opp_hand.length; a ++) {
                    if(opp_hand[a] > 0) { return false; }
                }
                return true;
            }})
        }
        else if (string[a] === "k") { term.push({ type: "pre",
            data: (col, pos) => { return board.has_attacked_ss.get(pos); } }); }
        else if (string[a] === "K") { term.push({ type: "pre",
            data: (col, pos) => { return !board.has_attacked_ss.get(pos); } }); }
        else if (string[a] === "d") {
            term.push({ type: "pre", at: true, data: (col, pos) => {
                return col ? board.black_attack_ss.get(pos) : board.white_attack_ss.get(pos);
            } });
        }
        else if (string[a] === "D") {
            term.push({ type: "pre", at: true, data: (col, pos) => {
                return col ? !board.black_attack_ss.get(pos) : !board.white_attack_ss.get(pos);
            } });
        }
        else if (string[a] === "x") {
            term.push({ type: "pre", at: true, data: (col, pos) => {
                return col ? board.white_attack_ss.get(pos) : board.black_attack_ss.get(pos);
            } });
        }
        else if (string[a] === "X") {
            term.push({ type: "pre", at: true, data: (col, pos) => {
                return col ? !board.white_attack_ss.get(pos) : !board.black_attack_ss.get(pos);
            } });
        }
        //Post-conditions
        //Data is a lambda that returns all squares it can't land on
        //at is how it applies to finding attacking squares
        //at=true: remove all spaces; at=false: skip, at=undefined: normal
        else if (string[a] === "a") { term.push({ type: "post", at: false,
            data: (col) => {
                return col ? ss_and(board.black_ss, board.white_ss.inverse()) :
                ss_and(board.white_ss, board.black_ss.inverse())
            } }); }
        else if (string[a] === "e") { term.push({ type: "post", at: true,
            data: (col) => { return col ? board.white_ss : board.black_ss } }); }
        else if (string[a] === "b") { term.push({ type: "post", at: false,
            data: () => { return ss_or(board.white_ss, board.black_ss).inverse() } }); }
        else if (string[a] === "c") { term.push({ type: "post", at: false,
            data: (col) => {
                return board.last_moved_col === col ? ss_or(board.white_ss, board.black_ss).inverse() :
                    ss_and(ss_or(board.white_ss, board.black_ss).inverse(), board.ep_mask.inverse());
            }
        });
        }
        else if (string[a] === "P") {
            let piece_data = pieces_in_bracket(string, a + 1);
            let data = lambda_on_pieces(piece_data.pieces, true);
            term.push({ type: "post", data: data });
            a = piece_data.pos;
        }
        else if (string[a] === "p") {
            let piece_data = pieces_in_bracket(string, a + 1);
            let data = lambda_on_pieces(piece_data.pieces, false);
            term.push({ type: "post", data: data });
            a = piece_data.pos;
        }
        else if (string[a] === "m") { term.push({ type: "post", 
            data: () =>  {return ss_and(ss_or(board.white_ss, board.black_ss), board.has_moved_ss)}}); }
        else if (string[a] === "B") {
            term.push({
                type: "post", data: (col, pos, current_moves) => {
                    let ret = new squareset(game_data.width * game_data.height);
                    let my_stoppers = ss_and(col ? stoppers.black : stoppers.white, current_moves);
                    for (; !my_stoppers.is_zero(); my_stoppers.pop()) {
                        ret.ore(get_bnb_ss(pos, my_stoppers.get_ls1b(), game_data.precompute));
                    }
                    return ret;
                }
            });
        }
        else if (string[a] === "G") {
            let piece_data = pieces_in_bracket(string, a + 1);
            term.push({
                type: "post", data: (col, pos, current_moves) => {
                    let ret = new squareset(game_data.width * game_data.height);
                    for (let p = 0; p < piece_data.pieces.length; p ++) {
                        let this_piece_ss = ss_and(board.piece_ss[piece_data.pieces[p]], current_moves);
                        for (; !this_piece_ss.is_zero(); this_piece_ss.pop()) {
                            ret.ore(get_bnb_ss(pos, this_piece_ss.get_ls1b(), game_data.precompute));
                        }
                    }
                    return ret;
                }
            });
            a = piece_data.pos;
        }
        else if (string[a] === "Z") {
            let nums = get_2_zones(string, a + 1);
            term.push({
                type: "post", data: (col, pos) => {
                    let zone = col ? game_data.zones[nums.num2] : game_data.zones[nums.num1];
                    return zone.get(pos) ? zone.inverse() : new squareset(game_data.width * game_data.height);
                }
            });
            a = nums.pos;
        }
        else if (string[a] === "O") {
            let nums = get_2_zones(string, a + 1);
            term.push({ type: "post", data: (col) => { return col? game_data.zones[nums.num2] : game_data.zones[nums.num1] } });
            a = nums.pos;
        }
        //Misc
        else if (string[a] === "s") { term.push({ type: "stop"}); }
        else if (string[a] === "-") { term.push({ type: "sub"}); }
        else if (string[a] === "^") { repeat = term.length; }
    }
    //If the term had a ^, add repeat to the term
    if (repeat > -1) {
        term.push({ type: "rep", data: repeat });
    }
    return term;
}

function get_2_nums(string, start_at) {
    let data = words_in_bracket(string, start_at);
    let nums = [];
    for (let a = 0; a < data.words.length; a++) {
        if (!isNaN(data.words[a])) {
            nums.push(Number(data.words[a]));
        }
    }
    return { num1: nums[0], num2: nums[1], pos: data.pos };
}
function get_2_zones(string, start_at) {
    let data = words_in_bracket(string, start_at);
    let nums = [];
    for (let a = 0; a < data.words.length; a++) {
        nums.push(get_zone_and_push(data.words[a]));
    }
    return { num1: nums[0], num2: nums[1], pos: data.pos };
}
function get_1_num(string, start_at) {
    let data = words_in_bracket(string, start_at);
    for (let a = 0; a < data.words.length; a++) {
        if (!isNaN(data.words[a])) {
            return { num: Number(data.words[a]), pos: data.pos };
        }
    }
    return { num: -1, pos: data.pos };
}

function lambda_on_pieces(pieces, inverse) {
    let data;
    if (pieces.length === 1) {
        data = () => {
            return inverse ? board.piece_ss[pieces[0]].inverse() : board.piece_ss[pieces[0]];
        };
    } else if (pieces.length > 1) {
        data = () => {
            let ret = new squareset(game_data.width * game_data.height);
            for (let a = 0; a < pieces.length; a++) {
                ret.ore(board.piece_ss[pieces[a]]);
            }
            return inverse ? ret.inverse() : ret;
        }
    } else {
        data = () => { return new squareset(game_data.width * game_data.height, inverse? 1 : 0) };
    }
    return data;
}

function pieces_in_bracket(string, start_at) {
    let all_words = words_in_bracket(string, start_at);
    let pieces = [];
    for (let b = 0; b < all_words.words.length; b++) {
        let piece_id = game_data.all_pieces.findIndex(p => p.name === all_words.words[b]);
        if (piece_id < 0) {
            piece_id = game_data.all_pieces.findIndex(p => p.symbol === all_words.words[b])
        }
        if (piece_id >= 0) {
            pieces.push(piece_id);
        }
    }
    return { pieces: pieces, pos: all_words.pos };
}

function words_in_bracket(string, start_at) {
    //Find start and end
    let open = -1, close = -1;
    for (let a = start_at; a < string.length; a++) {
        if (string[a] === "{" && open < 0) {
            open = a;
        }
        if (string[a] === "}" && open >= 0) {
            close = a;
            break;
        }
    }
    let in_brackets = string.substr(open + 1, close - open - 1);
    let words = in_brackets.split(" ");
    return { words: words, pos: close };
}

function read_number(string, pos) {
    //Get to the first digit (or -)
    while (pos < string.length && (string[pos] < "0" || string[pos] > "9")
        && !(string[pos] === "-" && pos < string.length - 1 && string[pos + 1] >= 0 && string[pos + 1] <= "9")) {
        pos++;
    }
    let isNegative = false;
    if (string[pos] === "-") {
        pos++;
        isNegative = true;
    }
    let num = string[pos] - "0";
    pos++;
    //Read all subsequent digits
    while (pos < string.length && string[pos] >= "0" && string[pos] <= "9") {
        num *= 10;
        num += string[pos] - "0";
        pos++;
    }
    //Return the number you read, and the position of the first non-digit
    return { num: isNegative ? -num : num, pos: pos };
}

function remove_nested_parenthases(string, open_char="(", close_char=")") {
    let parenth_layers = 0;
    let ret = "";
    for (let a = 0; a < string.length; a ++) {
        if (string[a] === open_char) {
            parenth_layers ++;
            if (parenth_layers === 1) {
                ret += open_char;
            }
        }
        else if (string[a] === close_char) {
            parenth_layers --;
            if(parenth_layers === 0) {
                ret += close_char;
            }
        }
        else {
            ret += string[a];
        }
    }
    return ret;
}

function generate_move_ss(string_orig) {
    let string = string_orig;
    for(let i = 0; i < preset_move_types.length; i ++) {
        string = string.replaceAll(preset_move_types[i].a, preset_move_types[i].b)
    }
    string = remove_nested_parenthases(string);

    let ret = [];
    if (string === "U") {
        //Every element is a shallow copy of all active squares on the board
        //return JSON.parse(JSON.stringify(game_data.active_squares));
        for (let a = 0; a < game_data.width * game_data.height; a++) {
            ret.push([]);
            for (let b = 0; b < 8; b++) {
                ret[a].push(game_data.active_squares);
            }
        }
    } else if (string.includes("(")) {
        //Add up several get_slide_ss calls
        let move_list = string.substr(1, string.length - 2).split(",");
        for (let pos = 0; pos < game_data.width * game_data.height; pos++) {
            let pos_x = pos % game_data.width;
            let pos_y = Math.floor(pos / game_data.width);
            ret.push([]);
            for (let angle = 0; angle < 8; angle++) {
                //ret[pos].push(new squareset(game_data.width*game_data.height));
                ret[pos][angle] = new squareset(game_data.width*game_data.height);
                for (let a = 0; a < move_list.length; a++) {
                    let nums = move_list[a].substr(1, move_list[a].length - 2).split(" ");
                    ret[pos][angle].ore(get_slide_ss(pos_x, pos_y, nums[0]-"0", nums[1]-"0", angle, nums[2]-"0", nums[3]-"0"));
                }
            }
        }
    } else {
        //Add one get_slide_ss to the array
        let nums = string.substr(1, string.length - 2).split(" ");
        for (let pos = 0; pos < game_data.width * game_data.height; pos++) {
            let pos_x = pos % game_data.width;
            let pos_y = Math.floor(pos / game_data.width);
            ret.push([]);
            for (let angle = 0; angle < 8; angle++) {
                ret[pos][angle] = (get_slide_ss(pos_x, pos_y, nums[0]-"0", nums[1]-"0", angle, nums[2]-"0", nums[3]-"0"));
            }
        }
    }
    return ret;
}

function generate_1_move_ss(string_orig, pos, angle) {
    let string = string_orig;
    for(let i = 0; i < preset_move_types.length; i ++) {
        string = string.replaceAll(preset_move_types[i].a, preset_move_types[i].b)
    }
    string = remove_nested_parenthases(string);

    let pos_x = pos % game_data.width;
    let pos_y = Math.floor(pos / game_data.width);

    if (string === "U") {
        return game_data.active_squares;
    }
    if (string.includes("(")) {
        //Add up several get_slide_ss calls
        let ret = new squareset(game_data.width*game_data.height);
        let move_list = string.substr(1, string.length - 2).split(",");
        for (let a = 0; a < move_list.length; a++) {
            let nums = move_list[a].substr(1, move_list[a].length - 2).split(" ");
            ret.ore(get_slide_ss(pos_x, pos_y, nums[0]-"0", nums[1]-"0", angle, nums[2]-"0", nums[3]-"0"));
        }
        return ret;
    }
    //Add one get_slide_ss to the array
    let nums = string.substr(1, string.length - 2).split(" ");
    return get_slide_ss(pos_x, pos_y, nums[0]-"0", nums[1]-"0", angle, nums[2]-"0", nums[3]-"0");
}

function get_move_ss(move, pos, angle) {
    if (typeof(move) === "number") {
        return game_data.move_ss[move][pos][angle];
    }
    return generate_1_move_ss(move, pos, angle);
}

function set_piece_space(piece, col, pos, rand, apply_fischer = false) {
    if (pos >= game_data.width * game_data.height) {
        show_error("Trying to place a piece out of the board bounds. Make sure your piece setup doesn't exceed the board's width * height.")
    }
    //If this is a fischer random space, set its position randomly
    if (apply_fischer) {
        let my_fischer_zone = new squareset(game_data.width * game_data.height);
        for (let a = 0; a < game_data.fischer_zones.length; a++) {
            if (game_data.zones[game_data.fischer_zones[a]].get(pos)) {
                my_fischer_zone.ore(game_data.zones[game_data.fischer_zones[a]]);
            }
        }
        my_fischer_zone.ande(ss_or(board.white_ss, board.black_ss).inverse());
        if (!my_fischer_zone.is_zero()) {
            //Find a random bit in my_fischer_zone and set pos to it
            let possible_squares = [];
            for (let a = 0; a < game_data.width * game_data.height; a++) {
                if (my_fischer_zone.get(a)) {
                    possible_squares.push(a);
                }
            }
            pos = possible_squares[Math.floor(rand() * possible_squares.length)];
        }
    }

    board.piece_ss[piece].set_on(pos);
    if (col === "w" || col === "n") {
        board.white_ss.set_on(pos);
    }
    if (col === "b" || col === "n") {
        board.black_ss.set_on(pos);
    }
    let attributes = get_attributes(piece);
    if (!attributes.includes(attrib.ghost)) {
        board.solid_ss.set_on(pos);
    }
    if (attributes.includes(attrib.iron)) {
        board.iron_ss.set_on(pos);
    }
    if (attributes.includes(attrib.tall)) {
        board.tall_ss.set_on(pos);
    }
    if (attributes.includes(attrib.royal)) {
        board.royal_ss.set_on(pos);
    }
    if (attributes.includes(attrib.burn_passive)) {
        board.passive_burn_ss.set_on(pos);
    }
    if (attributes.includes(attrib.burn_immune)) {
        board.burn_immune_ss.set_on(pos);
    }
    if (attributes.includes(attrib.spawn_constant)) {
        board.constant_spawn_ss.set_on(pos);
    }
}
