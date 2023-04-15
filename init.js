var canvas;

function on_board(x, y) {
    if (y === undefined) {
        //Only square id given
        y = Math.floor(x / game_data.width);
        x %= game_data.width;
    }
    return x >= 0 && y >= 0 && x < game_data.width && y < game_data.height && game_data.active_squares.get(y * game_data.width + x);
}

function fix_canvas_height() {
    //Find and set canvas height
    let ratio = (game_data.height + (game_data.has_hand ? 2 : 0)) / game_data.width;
    canvas.height = canvas.width * ratio;
    //Set history height
    let history = document.getElementById("history_div");
    let h = Number(history.style.height.substring(0, history.style.height.length-2));
    history.style.height = (canvas.offsetHeight-history.offsetHeight+h)+"px";
}

function change_zoom(amount) {
    canvas.width = canvas.width + 50 * amount;
    fix_canvas_height();
}

function add_pieces_then_reload(images) {
    images = [...new Set(images)];
    images = images.filter(e => !document.getElementById("img_" + e));
    let to_load = images.length;
    for (let a = 0; a < images.length; a++) {
        let img1 = new Image();
        img1.onload = function () {
            to_load--;
            if (to_load === 0) {
                render_board();
            }
        }
        img1.onerror = () => {
            show_error(`Error loading image '${images[a]}'`);
        }
        img1.src = "images/pieces/" + images[a] + ".png";
        img1.id = "img_" + images[a];
        document.getElementById("imageDiv").appendChild(img1);
    }
}
function add_image(dname, fname) {
    if (!document.getElementById("img_" + fname)) {
        let img1 = new Image();
        img1.onerror = () => {
            show_error(`Error loading image '${fname}'`);
        }
        img1.src = "images/" + dname + "/" + fname + ".png";
        img1.id = "img_" + fname;
        document.getElementById("imageDiv").appendChild(img1);
    }
}

//Doesn't work, it's too long!
function print_all_boards() {
    let str = "{";
    for(let a = 0; a < preset_variants.length; a++) {
        for(let b = 0; b < preset_variants[a].length; b++) {
            str += "\""+preset_variants[a][b].name+"\": "+JSON.stringify(preset_variants[a][b]);
            if(a < preset_variants.length-1 || b < preset_variants[a].length-1) {
                str += ",";
            }
        }
    }
    str += "}";
    return str;
}
//Will only work if you have access to the database
function update_all_boards() {
    for(let a = 0; a < preset_variants.length; a++) {
        for(let b = 0; b < preset_variants[a].length; b++) {
            preset_variants[a][b].code = preset_variants[a][b].name.toLowerCase();
            firebase.database().ref("boards").child(preset_variants[a][b].name.toLowerCase()).update(preset_variants[a][b]);
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

function handle_download_btn(){
    let canvas = document.getElementById("board_canvas");
    let link = document.createElement('a');
    link.download = 'TCR_Board.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
}

function toggle_credits() {
    let div = document.getElementById("credits_div");
    if (div.style.display === "none") {
        div.style.display = "block";
    }
    else {
        div.style.display = "none";
    }
}

function download_all_boards() {
    for(let a = 0; a < preset_variants.length; a++) {
        for(let b = 0; b < preset_variants[a].length; b++) {
            let str = JSON.stringify(stringify_consts(preset_variants[a][b]), null, 2);
            let file = new File([str], preset_variants[a][b].name);
            let url = URL.createObjectURL(file);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = preset_variants[a][b].name+".json";
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(url);
        }
    }
}
function download_json(json) {
    let str = JSON.stringify(stringify_consts(json), null, 2);
    let file = new File([str], json.name);
    let url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = json.name+".json";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}

function download_board(folder, index) {
    download_json(preset_variants[folder][index]);
}

function handle_export_btn() {
    //document.getElementById('history').value = export_history();
    let hist = export_history();
    navigator.clipboard.writeText(hist);
    alert("History copied to clipboard:\n"+hist);
}
function handle_import_btn() {
    let hist = prompt('Paste the exported history here:');
    view_move = 0;
    if (!hist) {
        show_error("Imported history was blank");
    } 
    else {
        import_history_firebase(hist);
    }
    render_board();
}
let is_editing_name = false;
function handle_name_btn() {
    let name_input = document.getElementById("name_input");
    let name_p = document.getElementById("name_p");
    let name_btn = document.getElementById("name_btn");
    if (is_editing_name) {
        set_name();
        name_input.style.display = "none";
        name_p.style.display = "inline";
        name_btn.innerHTML = "✏️";
    }
    else {
        name_input.style.display = "inline";
        name_input.value = name_p.innerHTML;
        name_p.style.display = "none";
        name_btn.innerHTML = "✔️";
    }
    is_editing_name ^= 1;
}

function handle_upload_btn() {
    upload_board();
}

function add_files_to_dropdown() {
    let variant_dropdown = document.getElementById("variantField");
    let variant_file_label = document.getElementById("variant_file_label");
    let category = document.getElementById("categoryField");
    let cat_num = Number(category.value);
    if(cat_num < 0) {
        variant_file_label.style.display="inline";
        variant_dropdown.style.display="none";
    }
    else {
        variant_file_label.style.display="none";
        variant_dropdown.style.display="inline";
        variant_dropdown.innerHTML = "";
        for (let a = 0; a < preset_variants[cat_num].length; a++) {
            let temp = new Option();
            temp.value = a;
            temp.innerHTML = DOMPurify.sanitize(preset_variants[cat_num][a].name);
            variant_dropdown.appendChild(temp);
        }
    }
}
function download_variant() {
    if (last_loaded_board === undefined) {
        show_error("No board loaded");
    }
    else {
        download_json(last_loaded_board);
    }
}
function load_variant() {
    let category = Number(document.getElementById("categoryField").value);
    if(category < 0) {
        let file = document.getElementById("variant_file").files[0];
        if (file) {
            let reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                try {
                    start_game(JSON.parse(evt.target.result), undefined, true)
                }
                catch (error){
                    show_error(error.message)
                }
            }
            reader.onerror = function (evt) {
                show_error("Couldn't read the file");
            }
        }
    }
    else {
        start_game(preset_variants[category][document.getElementById('variantField').value]);
    }
}
function load_random_variant() {
    let all_variants = [];
    for (let a = 0; a < preset_variants.length; a ++) {
        for (let b = 0; b < preset_variants[a].length; b ++) {
            all_variants.push({a, b});
        }
    }
    let index = Math.floor(Math.random()*all_variants.length);
    let category = all_variants[index].a, file = all_variants[index].b;
    start_game(preset_variants[category][file]);
}

function load_board_textures() {
    add_image("board", "sq_dark");
    add_image("board", "sq_light");
    add_image("board", "sq_canmove");
    add_image("board", "sq_canmove_potential");
    add_image("board", "sq_canmove_sel");
    add_image("board", "sq_canmove_turn");
    add_image("board", "hand_bg");
    add_image("board", "glow");
    add_image("board", "glow_check");
    add_image("board", "full_space");
    add_image("board", "attack_white");
    add_image("board", "attack_black");
    add_image("board", "movable");
}

function handle_inspect_button() {
    if (temp_data.inspect) {
        temp_data.inspect = false;
        document.getElementById("inspect_text").style.display="none";
    }
    else {
        temp_data.inspect = true;
        document.getElementById("inspect_text").style.display="inline";
    }
}

function handle_make_move(src_x, src_y, dst_x, dst_y, prom) {
    if(in_multiplayer_game) {
        multiplayer_make_move(src_x, src_y, dst_x, dst_y, prom);
    }
    else {
        make_move(src_x, src_y, dst_x, dst_y, prom);
    }
}
function handle_make_drop(piece, color, dest, prom) {
    if(in_multiplayer_game) {
        multiplayer_make_drop(piece, color, dest, prom);
    }
    else {
        make_drop_move(piece, color, dest, prom);
    }
}

function handle_mouse_click() {
    let brd = board_history[view_move];

    if (game_data.width === undefined) {
        return;
    }
    if (brd.victory != -1) {
        return;
    }
    if (temp_data.waiting_for_promotion) {
        let width_px = canvas.width / game_data.width; //Width and height should be the same
        let height_px = canvas.height / (game_data.height + (game_data.has_hand ? 2 : 0));
        let start_height = canvas.height / 2 - height_px / 2;
        let start_width = canvas.width / 2 - height_px * temp_data.promotions.length / 2;
        let clicked_piece = Math.floor((mouse_pos.x - start_width) / width_px);
        if (mouse_pos.y >= start_height && mouse_pos.y <= start_height + height_px
            && clicked_piece >= 0 && clicked_piece < temp_data.promotions.length) {
            let prom = temp_data.promotions[clicked_piece];
            let src = temp_data.selected_position, dst = temp_data.move_to;
            let src_x = src % game_data.width, src_y = Math.floor(src / game_data.width);
            let dst_x = dst % game_data.width, dst_y = Math.floor(dst / game_data.width);
            if(validate_move(src_x, src_y, dst_x, dst_y, prom)) {
                handle_make_move(src_x, src_y, dst_x, dst_y, prom);
            }
            else {
                show_error("Invalid move attempted after promotion was selected. This should be reported in #bug-reports.");
            }
            temp_data.selected = false;
        }
        temp_data.waiting_for_promotion = false;
    }
    else if (temp_data.inspect) {
        document.getElementById("inspect_text").style.display="none";
        temp_data.inspect = false;
        let piece = identify_piece(mouse_sq);
        if (piece >= 0) {
            let p = game_data.all_pieces[piece];
            alert(DOMPurify.sanitize(`${p.name}\n${p.description}`));
        }
    }
    else if (temp_data.selected) {
        //if (game_data.active_squares.get(mouse_sq)) {
            if (brd.can_move_ss[temp_data.selected_position].get(mouse_sq)) {
                //See how many promotions are possible
                let src = temp_data.selected_position, dst = mouse_sq;
                let promote_to = find_promotions(identify_piece(src, brd), src, dst, brd.white_ss.get(src), brd.black_ss.get(src), brd);
                let src_x = src % game_data.width, src_y = Math.floor(src / game_data.width);
                let dst_x = mouse_sq_pos.x, dst_y = mouse_sq_pos.y;
                if (promote_to.length < 2) {
                    if(validate_move(src_x, src_y, dst_x, dst_y)) {
                        handle_make_move(src_x, src_y, dst_x, dst_y);
                    }
                    else {
                        show_error("Invalid move attempted. This should be reported in #bug-reports.");
                    }
                    temp_data.selected = false;
                }
                else if (game_data.all_pieces[identify_piece(src, brd)].attributes.includes(attrib.random_promotion)) {
                    let prom = promote_to[Math.floor(Math.random() * promote_to.length)];
                    if(validate_move(src_x, src_y, dst_x, dst_y, prom)) {
                        handle_make_move(src_x, src_y, dst_x, dst_y, prom);
                    }
                    else {
                        show_error("Invalid move attempted (random promotion). This should be reported in #bug-reports.");
                    }
                    temp_data.selected = false;
                }
                else {
                    temp_data.waiting_for_promotion = true;
                    temp_data.promotions = promote_to;
                    temp_data.move_to = mouse_sq;
                }
            }
            else {
                temp_data.selected = false;
            }
        //}
    }
    else if (temp_data.hand_selected) {
        if (mouse_sq >= 0 && mouse_sq < game_data.width * game_data.height) {
            let drop_zone = temp_data.selected_side ?
                board.can_drop_piece_to.black[temp_data.selected_position]:
                board.can_drop_piece_to.white[temp_data.selected_position];
            if (drop_zone.get(mouse_sq) && !brd.white_ss.get(mouse_sq) && !brd.black_ss.get(mouse_sq)) {
                //Piece, color, dest
                if(validate_drop(temp_data.selected_position, temp_data.selected_side, mouse_sq)) {
                    handle_make_drop(temp_data.selected_position, temp_data.selected_side, mouse_sq);
                }
                else {
                    show_error("Invalid drop attempted. This should be reported in #bug-reports.");
                }
            }
        }
        temp_data.hand_selected = false;
    }
    else if (mouse_sq_pos.y === -1 || mouse_sq_pos.y === game_data.height) {
        //We clicked a hand
        let hover = highlighted_hand_piece(brd);
        if (hover.piece >= 0 && hover.color === brd.turn && (!in_multiplayer_game || brd.turn === my_col) && slots_left(hover.piece, hover.color, brd)) {
            temp_data.hand_selected = true;
            temp_data.selected_side = hover.color;
            temp_data.selected_position = hover.piece;
        }
    } 
    else {
        if ((!brd.turn && brd.white_ss.get(mouse_sq))
            || (brd.turn && brd.black_ss.get(mouse_sq))) {
            if (!brd.can_move_ss[mouse_sq].is_zero() && (!in_multiplayer_game || brd.turn === my_col) && can_move(brd.turn, brd)) {
                temp_data.selected = true;
                temp_data.selected_position = mouse_sq;
            }
        }
    }
    clear_lines_circles();
    render_board();
}

let down_sq = -1;
let line_col = 'green';
function handle_left_down() {
    down_sq = mouse_sq;
    render_board();
}
function handle_left_up() {
    if (down_sq === mouse_sq) {
        add_circle({sq: mouse_sq, col: line_col});
    }
    else {
        add_line({sq1: down_sq, sq2: mouse_sq, col: line_col});
    }
    down_sq = -1;
    render_board();
}

function handle_mouse_leave() {
    if (game_data.width != undefined) {
        mouse_sq = -1;
        mouse_sq_pos = { x: -1, y: -1 };
        old_mouse_sq = -1;
    }
    render_board();
}

function board_page() {
    document.getElementById("board_section").style.display = "block";
    document.getElementById("lobby_section").style.display = "none";
    document.getElementById("board_page_button").style.display = "none";
    document.getElementById("lobby_page_button").style.display = "block";
}
function lobby_page() {
    document.getElementById("board_section").style.display = "none";
    document.getElementById("lobby_section").style.display = "block";
    document.getElementById("board_page_button").style.display = "block";
    document.getElementById("lobby_page_button").style.display = "none";
}

function handle_mouse_move(e) {
    let rect = e.currentTarget.getBoundingClientRect();
    let x_offset = canvas.clientWidth - canvas.offsetWidth;
    let y_offset = canvas.clientHeight - canvas.offsetHeight;
    mouse_pos.x = e.clientX - rect.left + x_offset/2;
    mouse_pos.y = e.clientY - rect.top + y_offset/2;
    if (game_data.width != undefined) {
        mouse_sq_pos.x = Math.min(Math.floor(mouse_pos.x * game_data.width / canvas.width), game_data.width-1);
        mouse_sq_pos.y = Math.floor(mouse_pos.y * (game_data.height + game_data.has_hand * 2) / canvas.height) - game_data.has_hand;
        if (style_data.flip_board) {
            mouse_sq_pos.x = game_data.width - mouse_sq_pos.x - 1;
            mouse_sq_pos.y = game_data.height - mouse_sq_pos.y - 1;
        }
        mouse_sq = mouse_sq_pos.x + mouse_sq_pos.y * game_data.width;
        if (mouse_sq != old_mouse_sq) {
            //If mouse changes square, re-render the board
            render_board();
            old_mouse_sq = mouse_sq;
        }
    }
}
function left_arrow_click() {
    if (view_move > 0) {
        view_move--;
        render_board();
        render_extras();
    }
}
function right_arrow_click() {
    if (view_move < board_history.length - 1) {
        view_move ++;
        render_board();
        render_extras();
    }
}
function down_arrow_click() {
    view_move = board_history.length - 1;
    render_board();
    render_extras();
}
function up_arrow_click() {
    view_move = 0;
    render_board();
    render_extras();
}
function add_circle(circle) {
    if (circle.sq === undefined || circle.sq < 0) {
        return;
    }
    let index = circles.findIndex(e => e.sq === circle.sq);
    if (index != -1) {
        if (circles[index].col === line_col) {
            circles.splice(index, 1);
        }
        else {
            circles.splice(index, 1);
            circles.push(circle);
        }
    }
    else {
        circles.push(circle);
    }
    render_board();
}
//Line is an object like {sq1: number, sq2: number}
function add_line(line) {
    let max = game_data.width * game_data.height;
    if(line === undefined || line.sq1 < 0 || line.sq1 >=  max || line.sq2 < 0 || line.sq2 >= max) {
        return;
    }
    let index = lines.findIndex(e => (e.sq1 === line.sq1 && e.sq2 === line.sq2));
    if (index > -1) {
        if (lines[index].col === line_col) {
            lines.splice(index, 1);
        }
        else {
            lines.splice(index, 1);
            lines.push(line);
        }
    }
    else {
        lines.push(line);
    }
    render_board();
}
function clear_lines_circles() {
    lines = [];
    circles = [];
    render_board();
}

let game_data = {};
let board = {};
let temp_data = {};
let circles = [];
let lines = [];
let board_history = [];
let move_history = [];
let view_move = 0;

let mouse_pos = { x: -1, y: -1 };
let mouse_sq_pos = { x: -1, y: -1 };
let mouse_sq = -1, old_mouse_sq = -1;


function page_init() {
    canvas = document.getElementById("board_canvas");
    add_files_to_dropdown();
    load_board_textures();
    document.getElementById("upload_name").value="";

    document.getElementById("variant_file").addEventListener('change', e => {
        let fileName = '';
        fileName = String(e.target.value).slice(12);
        document.getElementById("file-selected").innerHTML=fileName;
    })

    canvas.addEventListener('mousemove', e => {
        handle_mouse_move(e);
    });
    canvas.addEventListener('mouseleave', e => {
        handle_mouse_leave();
    });
    canvas.addEventListener('mousedown', e => {
        if(e.button === 0) {
            handle_mouse_click();
        }
        else if(e.button === 2) {
            handle_left_down();
        }
    });
    canvas.addEventListener('mouseup', e => {
        if(e.button === 2) {
            handle_left_up();
        }
    });
    document.onkeydown = function (e) {
        switch (e.keyCode) {
            case 37:
                left_arrow_click();
                break;
            case 39:
                right_arrow_click();
                break;
        }
    };
    board_page();
    start_game(preset_variants[folders.chess][0]);
    refresh_checkboxes();
    reload_style_inputs();
}