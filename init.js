let canvas;

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
    set_style_type();
    set_intersection_type();
    document.getElementById("upload_name").value="";

    document.getElementById("board_name").addEventListener("keypress", e => {
        if (e.key === "Enter") {
            add_lobby();
        }
    }); 

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