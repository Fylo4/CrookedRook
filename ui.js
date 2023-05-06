let down_sq = -1;
let line_col = 'green';
function handle_left_down() {
    down_sq = mouse_sq;
    render_circles_and_lines();
}
function handle_left_up() {
    if (down_sq === mouse_sq) {
        add_circle({sq: mouse_sq, col: line_col});
    }
    else {
        add_line({sq1: down_sq, sq2: mouse_sq, col: line_col});
    }
    down_sq = -1;
    render_circles_and_lines();
}

function handle_mouse_leave() {
    if (game_data.width != undefined) {
        mouse_sq = -1;
        mouse_sq_pos = { x: -1, y: -1 };
        old_mouse_sq = -1;
    }
    render_circles_and_lines();
    render_move_squares();
}

function change_zoom(amount) {
    let canvas = document.getElementById("board_canvas_0")
    canvas.width = canvas.width + 50 * amount;
    fix_canvas_height();
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

function handle_download_btn(){
    let canvas = document.getElementById("board_canvas");
    let link = document.createElement('a');
    link.download = 'TCR_Board.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
}

function hide_export_div() {
    document.getElementById("export_div").style.display = "none";
}

function handle_export_btn() {
    //document.getElementById('history').value = export_history();
    let hist = export_history();
    navigator.clipboard.writeText(hist);
    document.getElementById("export_code_p").innerHTML = hist;
    open_modal('export');

    // alert("History copied to clipboard:\n"+hist);
    // document.getElementById("export_div").style.display = "block";
    // document.getElementById("export_p").innerHTML = hist;
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
    render_entire_board();
}
let is_editing_name = false;
function handle_name_btn() {
    let name_input = document.getElementById("name_input");
    let name_btn = document.getElementById("name_btn");
    if (is_editing_name) {
        set_name();
        name_input.style.display = "none";
        show_name_p();
        name_btn.innerHTML = "✏️";
    }
    else {
        name_input.style.display = "inline";
        name_input.value = get_name_p();
        hide_name_p();
        name_btn.innerHTML = "✔️";
    }
    is_editing_name ^= 1;
}

function handle_upload_btn() {
    upload_board();
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

function set_style_type() {
    style_data.style = document.getElementById("style_select").value;
    set_style_modal();
    render_entire_board();
}

function set_intersection_type() {
    style_data.point_style = document.getElementById("intersection_select").value;
    render_entire_board();
}

function handle_advanced_style_btn() {
    let div = document.getElementById("style_div");
    div.style.display = div.style.display === "none" ? "block" : "none";
}

function handle_mouse_move(e) {
    let rect = e.currentTarget.getBoundingClientRect();
    let x_offset = front_canvas.clientWidth - front_canvas.offsetWidth;
    let y_offset = front_canvas.clientHeight - front_canvas.offsetHeight;
    mouse_pos.x = e.clientX - rect.left + x_offset/2;
    mouse_pos.y = e.clientY - rect.top + y_offset/2;
    if (game_data.width != undefined) {
        mouse_sq_pos.x = Math.min(Math.floor(mouse_pos.x * game_data.width / front_canvas.width), game_data.width-1);
        mouse_sq_pos.y = Math.floor(mouse_pos.y * (game_data.height + game_data.has_hand * 2) / front_canvas.height) - game_data.has_hand;
        if (style_data.flip_board) {
            mouse_sq_pos.x = game_data.width - mouse_sq_pos.x - 1;
            mouse_sq_pos.y = game_data.height - mouse_sq_pos.y - 1;
        }
        mouse_sq = mouse_sq_pos.x + mouse_sq_pos.y * game_data.width;
        if (mouse_sq != old_mouse_sq) {
            //If mouse changes square, re-render the board
            render_move_squares();
            render_circles_and_lines();
            old_mouse_sq = mouse_sq;
        }
    }
}
function left_arrow_click() {
    if (view_move > 0) {
        view_move--;
        render_after_move();
        render_extras();
    }
}
function right_arrow_click() {
    if (view_move < board_history.length - 1) {
        view_move ++;
        render_after_move();
        render_extras();
    }
}
function down_arrow_click() {
    view_move = board_history.length - 1;
    render_after_move();
    render_extras();
}
function up_arrow_click() {
    view_move = 0;
    render_after_move();
    render_extras();
}

//This is too big, break this up!
function handle_mouse_click() {
    let brd = board_history[view_move];

    if (game_data.width === undefined) {
        return;
    }
    if (brd.victory != -1) {
        return;
    }
    if (temp_data.waiting_for_promotion) {
        let width_px = front_canvas.width / game_data.width; //Width and height should be the same
        let height_px = front_canvas.height / (game_data.height + (game_data.has_hand ? 2 : 0));
        let start_height = front_canvas.height / 2 - height_px / 2;
        let start_width = front_canvas.width / 2 - height_px * temp_data.promotions.length / 2;
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
            // alert(DOMPurify.sanitize(`${p.name}\n${p.description}`));
            document.getElementById('piece_modal_name').innerHTML = DOMPurify.sanitize(p.name);
            document.getElementById('piece_modal_desc').innerHTML = DOMPurify.sanitize(p.description);
            open_modal('piece');
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
                        render_after_move();
                    }
                    else {
                        show_error("Invalid move attempted. This should be reported in #bug-reports.");
                    }
                    temp_data.selected = false;
                }
                else if (get_attributes(identify_piece(src, brd)).includes(attrib.random_promotion)) {
                    let prom = promote_to[Math.floor(Math.random() * promote_to.length)];
                    if(validate_move(src_x, src_y, dst_x, dst_y, prom)) {
                        handle_make_move(src_x, src_y, dst_x, dst_y, prom);
                        render_after_move();
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
                    render_after_move();
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
    render_move_squares();
}

function show_name_p() {
    let all_p = document.getElementsByClassName("name_container");
    for (let a = 0; a < all_p.length; a ++) {
        all_p[a].classList.remove("hidden");
    }
}
function hide_name_p() {
    let all_p = document.getElementsByClassName("hide_name_container");
    for (let a = 0; a < all_p.length; a ++) {
        all_p[a].classList.add("hidden");
    }
}

function set_name_p(name) {
    let all_p = document.getElementsByClassName("name_container");
    for (let a = 0; a < all_p.length; a ++) {
        all_p[a].innerHTML = DOMPurify.sanitize(name);
    }
}
function get_name_p() {
    let all_p = document.getElementsByClassName("name_container");
    return all_p[0].innerHTML;
}

function set_clock_inputs() {
    let clock = document.getElementById("clock_sel");
    if (clock) {
        let increment_div = document.getElementById("increment_div")
        if (clock.value === "inc") {
            increment_div.classList.remove("hidden");
        }
        else {
            increment_div.classList.add("hidden");
        }
    }
}

function set_private_input() {
    let room_code = document.getElementById("private_code_div");
    let room_check = document.getElementById("private_room");
    if (room_code && room_check) {
        if (room_check.checked) {
            room_code.classList.remove("hidden");
        }
        else {
            room_code.classList.add("hidden");
        }
    }
}

function set_load_input() {
    let from = document.getElementById("from_select").value;
    let from_canon = document.getElementById("from_canon");
    let from_file = document.getElementById("from_file");
    let from_server = document.getElementById("from_server");
    let from_import = document.getElementById("from_import");
    
    from === "Canon" ? from_canon.classList.remove("hidden") : from_canon.classList.add("hidden");
    from === "File" ? from_file.classList.remove("hidden") : from_file.classList.add("hidden");
    from === "Server" ? from_server.classList.remove("hidden") : from_server.classList.add("hidden");
    from === "Import code" ? from_import.classList.remove("hidden") : from_import.classList.add("hidden");
}

function set_profile_dropdown() {
    if (is_signed_in) {
        document.getElementById("user_profile").classList.remove("hidden");
        document.getElementById("user_log_out").classList.remove("hidden");
        // document.getElementById("user_anonymous").classList.add("hidden");
        document.getElementById("user_google").classList.add("hidden");
    }
    else {
        document.getElementById("user_profile").classList.add("hidden");
        document.getElementById("user_log_out").classList.add("hidden");
        // document.getElementById("user_anonymous").classList.remove("hidden");
        document.getElementById("user_google").classList.remove("hidden");
    }
}

function set_style_modal() {
    let st = document.getElementById("style_select").value;
    if (["intersection", "xiangqi"].includes(st)) {
        document.getElementById("style_intersection_div").classList.remove("hidden");
    }
    else {
        document.getElementById("style_intersection_div").classList.add("hidden");
    }
}

function set_modal_listeners() {
    let modals = document.getElementsByTagName("dialog");

    for (let a = 0; a < modals.length; a ++) {
        modals[a].addEventListener('click', e => {
            if (e.target.tagName !== 'DIALOG') {
                return;
            }
            const dim = modals[a].getBoundingClientRect();
            if (e.clientX < dim.left || e.clientX > dim.right ||
                e.clientY < dim.top || e.clientY > dim.bottom) {
                    modals[a].close();
            }
        })
    }
}

function ui_init() {
    set_clock_inputs();
    set_private_input();
    set_load_input();
    set_modal_listeners();
    set_profile_dropdown();
    set_style_modal()
}