let style_data = {
    white_col: "rgb(240, 240, 240)",
    black_col: "rgb(60, 60, 60)",
    neutral_col: "rgb(0, 200, 100)",
    light_highlight_col: "rgb(214, 111, 105)",
    dark_highlight_col: "rgb(113, 50, 47)",
    light_highlight_2_col: "rgb(98, 193, 221)",
    dark_highlight_2_col: "rgb(50, 101, 109)",
    light_mud_col: "rgb(205, 148, 114)",
    dark_mud_col: "rgb(117, 70, 43)",
    light_ethereal_col: "rgb(160, 100, 220)",
    dark_ethereal_col: "rgb(80, 30, 130)",
    light_pacifist_col: "rgb(236, 202, 79)",
    dark_pacifist_col: "rgb(116, 100, 44)",
    light_sanctuary_col: "rgb(135, 198, 121)",
    dark_sanctuary_col: "rgb(60, 112, 48)",
    light_square_col: "rgb(255, 196, 136)",
    dark_square_col: "rgb(230, 115, 0)",
    bg_col: "rgb(240, 209, 153)",
    hand_col: "rgb(205, 137, 24)",
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
    style_data.attacked_squares = document.getElementById("attacked_squares_cb").checked;
    style_data.check_indicator = document.getElementById("check_indicator_cb").checked;
    style_data.movable_pieces = document.getElementById("movable_pieces_cb").checked;
    style_data.last_moved = document.getElementById("last_moved_cb").checked;
    style_data.show_highlights = document.getElementById("highlight_cb").checked;
    render_board();
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
        render_board();
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