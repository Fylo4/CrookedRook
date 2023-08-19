export class StyleData {
    white_col: string = "#F0F0F0";
    black_col: string = "#3C3C3C";
    neutral_col: string = "#00C864";
    light_highlight_col: string = "#D66F69";
    dark_highlight_col: string = "#71322F";
    light_highlight_2_col: string = "#62C1DD";
    dark_highlight_2_col: string = "#32656D";
    light_mud_col: string = "#CD9472";
    dark_mud_col: string = "#75462B";
    light_ethereal_col: string = "#A064DC";
    dark_ethereal_col: string = "#501E82";
    light_pacifist_col: string = "#ECCA4F";
    dark_pacifist_col: string = "#74642C";
    light_sanctuary_col: string = "#87C679";
    dark_sanctuary_col: string = "#3C7030";
    light_square_col: string = "#FFC488";
    dark_square_col: string = "#E67300";
    bg_col: string = "#F0D199";
    hand_col: string = "#CD8918";
    flip_colors: boolean = false;
    flip_board: boolean = false;
    name_squares: boolean = false;
    border: number = 0.05;
    lines: number = 0.075;
    attacked_squares: boolean = false;
    check_indicator: boolean = true;
    movable_pieces: boolean = false;
    last_moved: boolean = true;
    selected_hovered: boolean = true;
    show_highlights: boolean = true;
    style: string = "checkered";
    point_style: string = "4-corner";
    rotate_opp: boolean = false;
};
/* Styles (case insensitive):
 *   Checkered - Default checkered board
 *   Uncheckered - Draw squares uncheckered
 *   Ashtapada - Draw squares uncheckered and 'X' instead of highlight
 *   Intersection - Draw the intersections instead of the squares and diagonal lines instead of highlights
 *   Xiangqi - Intersection + Middle row has no vertical lines
 */
