let style_data = {
    white_col: "#F0F0F0",
    black_col: "#3C3C3C",
    neutral_col: "#00C864",
    light_highlight_col: "#D66F69",
    dark_highlight_col: "#71322F",
    light_highlight_2_col: "#62C1DD",
    dark_highlight_2_col: "#32656D",
    light_mud_col: "#CD9472",
    dark_mud_col: "#75462B",
    light_ethereal_col: "#A064DC",
    dark_ethereal_col: "#501E82",
    light_pacifist_col: "#ECCA4F",
    dark_pacifist_col: "#74642C",
    light_sanctuary_col: "#87C679",
    dark_sanctuary_col: "#3C7030",
    light_square_col: "#FFC488",
    dark_square_col: "#E67300",
    bg_col: "#F0D199",
    hand_col: "#CD8918",
    flip_colors: false,
    flip_board: false,
    name_squares: false,
    border: 0.05,
    lines: 0.075,
    attacked_squares: false,
    check_indicator: true,
    movable_pieces: false,
    last_moved: true,
    show_highlights: true,
    style: "checkered",
    point_style: "4-corner",
    rotate_opp: false,
};
/* Styles (case insensitive):
 *   Checkered - Default checkered board
 *   Uncheckered - Draw squares uncheckered
 *   Ashtapada - Draw squares uncheckered and 'X' instead of highlight
 *   Intersection - Draw the intersections instead of the squares and diagonal lines instead of highlights
 *   Xiangqi - Intersection + Middle row has no vertical lines
 */

function style_toggle() {
    let style_div = document.getElementById("style_buttons");
    if (style_div.style.display==="none") {
        style_div.style.display="block"
    }
    else{
        style_div.style.display="none"
    }
}

function refresh_checkboxes() {
    let get = e => document.getElementById(e).checked;
    style_data.attacked_squares = get("attacked_squares_cb");
    style_data.check_indicator = get("check_indicator_cb");
    style_data.movable_pieces = get("movable_pieces_cb");
    style_data.last_moved = get("last_moved_cb");
    style_data.show_highlights = get("highlight_cb");

    style_data.flip_board = get("flip_board_cb");
    style_data.rotate_opp = get("flip_opp_cb");
    style_data.name_squares = get("square_names_cb");
    render_entire_board();
}

function reload_style_inputs() {
    document.getElementById("style_piece_w").value = style_data.white_col;
    document.getElementById("style_piece_b").value = style_data.black_col;
    document.getElementById("style_piece_n").value = style_data.neutral_col;

    document.getElementById("style_sq_light").value = style_data.light_square_col;
    document.getElementById("style_sq_dark").value = style_data.dark_square_col;
    document.getElementById("style_hi_light").value = style_data.light_highlight_col;
    document.getElementById("style_hi_dark").value = style_data.dark_highlight_col;
    document.getElementById("style_hi2_light").value = style_data.light_highlight_2_col;
    document.getElementById("style_hi2_dark").value = style_data.dark_highlight_2_col;
    document.getElementById("style_md_light").value = style_data.light_mud_col;
    document.getElementById("style_md_dark").value = style_data.dark_mud_col;
    document.getElementById("style_et_light").value = style_data.light_ethereal_col;
    document.getElementById("style_et_dark").value = style_data.dark_ethereal_col;
    document.getElementById("style_pa_light").value = style_data.light_pacifist_col;
    document.getElementById("style_pa_dark").value = style_data.dark_pacifist_col;
    document.getElementById("style_sa_light").value = style_data.light_sanctuary_col;
    document.getElementById("style_sa_dark").value = style_data.dark_sanctuary_col;
    
    document.getElementById("style_bg").value = style_data.bg_col;
    document.getElementById("style_hand").value = style_data.hand_col;
}

function set_style() {
    style_data.white_col = document.getElementById("style_piece_w").value;
    style_data.black_col = document.getElementById("style_piece_b").value;
    style_data.neutral_col = document.getElementById("style_piece_n").value;
    
    style_data.light_square_col = document.getElementById("style_sq_light").value;
    style_data.dark_square_col = document.getElementById("style_sq_dark").value;
    style_data.light_highlight_col = document.getElementById("style_hi_light").value;
    style_data.dark_highlight_col = document.getElementById("style_hi_dark").value;
    style_data.light_highlight_2_col = document.getElementById("style_hi2_light").value;
    style_data.dark_highlight_2_col = document.getElementById("style_hi2_dark").value;
    style_data.light_mud_col = document.getElementById("style_md_light").value;
    style_data.dark_mud_col = document.getElementById("style_md_dark").value;
    style_data.light_ethereal_col = document.getElementById("style_et_light").value;
    style_data.dark_ethereal_col = document.getElementById("style_et_dark").value;
    style_data.light_pacifist_col = document.getElementById("style_pa_light").value;
    style_data.dark_pacifist_col = document.getElementById("style_pa_dark").value;
    style_data.light_sanctuary_col = document.getElementById("style_sa_light").value;
    style_data.dark_sanctuary_col = document.getElementById("style_sa_dark").value;
    
    style_data.bg_col = document.getElementById("style_bg").value;
    style_data.hand_col = document.getElementById("style_hand").value;

    if (board.turn != undefined) {
        render_entire_board();
    }
}

function export_style() {
    let str = JSON.stringify(style_data, null, 2);
    let file = new File([str], "style");
    let url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "style.json";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}

function import_style() {
    let file = document.getElementById("style_file").files[0];
    if (file) {
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            try {
                let n = file.name.toLowerCase();
                let style_object =
                    n.endsWith(".json") ? JSON.parse(evt.target.result) :
                    n.endsWith(".hjson")?Hjson.parse(evt.target.result) :
                    undefined;
                if (style_object) {
                    style_data = style_object;
                    render_entire_board();
                    show_message("Style data updated");
                }
                else {
                    show_error("File not recognized");
                }
            }
            catch (error){
                show_error(error.message)
            }
        }
        reader.onerror = function () {
            show_error("Couldn't read the file");
        }
    }
    else {
        show_error("No file selected");
    }
}

function set_style_listeners() {
    let ids = ["style_piece_w", "style_piece_b", "style_piece_n", "style_sq_light", "style_sq_dark", "style_hi_light",
    "style_hi_dark", "style_hi2_light", "style_hi2_dark", "style_md_light", "style_md_dark", "style_et_light",
    "style_et_dark", "style_pa_light", "style_pa_dark", "style_sa_light", "style_sa_dark", "style_bg", "style_hand"];
    
    ids.forEach(e => {
        document.getElementById(e).addEventListener('input', e => set_style());
    });
}