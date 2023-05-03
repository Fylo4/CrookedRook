//Must be called on a board that's currently loaded
//Loading a board fills in a lot of holes
//Otherwise I'd have to convert everything which would be a mess
function get_export_game_data() {
    let data = game_data;

    let ret = {};
    ret.n = data.name;
    if (data.author) { ret.a = data.author; }
    ret.i = data.description;
    ret.x = data.width;
    ret.y = data.height;
    if (data.turn_list.length != 2 || data.turn_list[0] || !data.turn_list[1]) {
        ret.t = data.turn_list;
    }
    if (data.flip_colors) { ret.fc = true; }
    if (data.castle_length != undefined && data.castle_length != 2) {
        ret.c = data.castle_length;
    }
    if (data.wins.length != 1 || data.wins[0] != ends.royal_capture) {
        ret.w = data.wins;
    }
    if (data.draws.length != 1 || data.draws[0] != ends.stalemate) {
        ret.d = data.draws;
    }
    if (data.has_hand) { ret.hh = true; }
    if (data.starting_hands) {
        for (let a = 0; a < data.starting_hands.white.length; a ++) {
            if (data.starting_hands.white[a] > 0 || data.starting_hands.black[a] > 0) {
                ret.sh = data.starting_hands;
                break;
            }
        }
    }
    if (data.drop_to_zone != undefined) {
        ret.dz = data.drop_to_zone;
    }
    ret.p = []; //Will be filled in below
    if (!data.active_squares.inverse().is_zero()) {
        ret.as = data.active_squares.backingArray;
    }
    ret.s = data.setup; //I won't bother optimizing this yet
    if (data.copy === "flip") { ret.cp = "f"; }
    if (data.copy === "rotate") { ret.cp = "r"; }
    if (data.zones != undefined && data.zones.length > 0) {
        ret.z = [];
        for (let a = 0; a < data.zones.length; a ++) {
            ret.z.push(data.zones[a].backingArray);
        }
    }
    if (data.fischer_zones != undefined && data.fischer_zones.length > 0) {
        ret.fz = [];
        for (let a = 0; a < data.fischer_zones.length; a ++) {
            ret.fz.push(data.fischer_zones[a]);
        }
    }
    if (data.mud != undefined && !data.mud.is_zero()) {
        ret.ms = data.mud.backingArray;
    }
    if (data.ethereal != undefined && !data.ethereal.is_zero()) {
        ret.es = data.ethereal.backingArray;
    }
    if (data.pacifist != undefined && !data.pacifist.is_zero()) {
        ret.ps = data.pacifist.backingArray;
    }
    if (data.sanctuary != undefined && !data.sanctuary.is_zero()) {
        ret.ss = data.sanctuary.backingArray;
    }
    if (data.highlight != undefined && !data.highlight.is_zero()) {
        ret.h = data.highlight.backingArray;
    }
    if (data.highlight2 != undefined && !data.highlight2.is_zero()) {
        ret.h2 = data.highlight2.backingArray;
    }
    if (data.snap_mode != undefined && data.snap_mode != "clockwise") {
        ret.sm = data.snap_mode;
    }
    if (data.force_drop) {
        ret.fd = true;
    }
    if (data.destroy_on_burn) {
        ret.db = true;
    }
    if (data.destroy_on_capture) {
        ret.dc = true;
    }
    if (data.berzerk) {
        ret.b = true;
    }
    if (data.style != undefined && data.style != "checkered") {
        ret.st = data.style;
    }

    //Now for the pieces!
    for (let a = 0; a < data.all_pieces.length; a ++) {
        let dp = data.all_pieces[a];
        let rp = {};
        rp.n = dp.name;
        if (dp.description != undefined && dp.description != "") {
            rp.d = dp.description;
        }
        rp.i = dp.sprite;
        if (dp.angle) {
            rp.r = dp.angle;
        }
        rp.s = dp.symbol;
        if (dp.notation != undefined) {
            rp.w = dp.notation;
        }
        rp.m = dp.move_str;
        if (dp.attributes != undefined && dp.attributes.length > 0) {
            rp.a = dp.attributes;
        }
        if (dp.promotions != undefined && dp.promotions.length > 0) {
            rp.p = [];
            for (let b = 0; b < dp.promotions.length; b ++) {
                let ap = {};
                if (!is_default_prom(data.zones[dp.promotions[b].white], data, false)) {
                    ap.w = dp.promotions[b].white;
                }
                if (!is_default_prom(data.zones[dp.promotions[b].black], data, true)) {
                    ap.b = dp.promotions[b].black;
                }
                if (dp.promotions[b].on.length != 1 || dp.promotions[b].on[0] != events.enter) {
                    ap.o = dp.promotions[b].on;
                }
                ap.t = dp.promotions[b].to;
                rp.p.push(ap);
            }
        }
        if (dp.drop_to_zone != undefined) {
            rp.z = dp.drop_to_zone;
        }
        if (dp.limit != undefined) {
            rp.l = dp.limit;
        }
        if (dp.file_limit != undefined) {
            rp.f = dp.file_limit;
        }
        if (dp.held_piece != undefined && dp.held_piece >= 0) {
            rp.hp = dp.held_piece;
        }
        if (dp.held_move != undefined) {
            rp.hm = dp.held_move;
        }
        if (dp.berzerk) {
            rp.berzerk = true;
        }
        ret.p.push(rp);
    }
    return ret;
}

function is_default_prom(ss, data, is_black) {
    let ss2 = new squareset(ss);
    for (let a = 0; a < data.width; a ++) {
        let sq = is_black ? (a + data.width*(data.height-1)) : a;
        if (!ss2.get(sq)) {
            return false;
        }
        ss2.set_off(sq);
    }
    return ss2.is_zero();
}

//Will only work if you have access to the database
function update_all_boards() {
    for(let a = 0; a < preset_variants.length; a++) {
        for(let b = 0; b < preset_variants[a].length; b++) {
            // console.log(preset_variants[a][b].name)
            // start_game(preset_variants[a][b]);
            // let upload_board = get_export_game_data()
            // upload_board.code = upload_board.n.toLowerCase();
            // firebase.database().ref("boards").child(upload_board.n.toLowerCase()).set({});
            // firebase.database().ref("boards").child(upload_board.n.toLowerCase()).update(upload_board);
            preset_variants[a][b].code = preset_variants[a][b].name.toLowerCase();
            firebase.database().ref("boards").child(preset_variants[a][b].name.toLowerCase()).set(preset_variants[a][b]);
        }
    }
}
function stringify_consts(json) {
    let ret = JSON.parse(JSON.stringify(json));
    if (ret.wins) {
        for (let a = 0; a < ret.wins.length; a ++) {
            if (typeof(ret.wins[a]) === "number") {
                ret.wins[a] = ends_str[ret.wins[a]];
            }
        }
    }
    if (ret.draws) {
        for (let a = 0; a < ret.draws.length; a ++) {
            if (typeof(ret.draws[a]) === "number") {
                ret.draws[a] = ends_str[ret.draws[a]];
            }
        }
    }
    for (let a = 0; a < ret.all_pieces.length; a ++){
        let piece = ret.all_pieces[a];
        if (piece.promotions) {
            for (let b = 0; b < piece.promotions.length; b ++){
                for (let c = 0; c < piece.promotions[b].on.length; c ++) {
                    if (typeof(piece.promotions[b].on[c]) === "number") {
                        piece.promotions[b].on[c] = events_str[piece.promotions[b].on[c]];
                    }
                }
            }
        }
        if (piece.attributes) {
            for (let b = 0; b < piece.attributes.length; b ++) {
                if (typeof(piece.attributes[b]) === "number") {
                    piece.attributes[b] = attrib_str[piece.attributes[b]];
                }
            }
        }
    }
    return ret;
}