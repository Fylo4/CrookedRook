import { Squareset, ss_and } from "../Squareset";
import { elemHeight, elemWidth, file, rank } from "../utils";
import { GameContainer } from "./GameContainer";

let c: HTMLCanvasElement[];
let ctx: CanvasRenderingContext2D[];
let width_px: number;
let height_px: number;
const cid = { //canvas ID's
    board: 0,
    glows: 1,
    pieces: 2,
    moves: 3,
    arrows: 4,
    menu: 5
}

//Only needs to be called on resize or init
function reload_variables(container: GameContainer) {
    c = container.canvases;
    ctx = [];
    for (let a = 0; a < c.length; a++) {
      let y = c[a].getContext("2d");
      if (y) {
        ctx.push(y);
      }
    }
    width_px = elemWidth(c[cid.board]) / container.gameData.width; //Width and height should be the same
    height_px = elemHeight(c[cid.board]) / (container.gameData.height + (container.gameData.hasHand() ? 2 : 0));
}

function checkForBreak(c: GameContainer): boolean {
    if (!c.canvasContainer || c.canvases.length === 0) return true;
    return false;
}

export function _render_entire_board(container: GameContainer){
    if (checkForBreak(container)) return;

    reload_variables(container);

    container.renderAllSpaces();
    container.renderGlows();
    container.renderPieces();
    if (container.clickData.clickMode === 'move')
        container.renderMoveSquares();
    container.renderCirclesAndLines();
    container.renderPromotionMenu();
}

//Don't re-render spaces
export function _render_after_move(container: GameContainer) {
    if (checkForBreak(container)) return;

    container.renderGlows();
    container.renderPieces();
    container.renderMoveSquares();
    container.renderCirclesAndLines();
    container.renderPromotionMenu();
}

function clear_layer(layer: number) {
    ctx[layer].clearRect(0, 0, elemWidth(c[layer]), elemHeight(c[layer]));
}

//Just the background, not including pieces, glows, etc.
//Can be called with only one parameter
function render_space(container: GameContainer, a: number, b?: number) {
    let gd = container.gameData;
    let sd = container.styleData;
    if (b === undefined) {
        b = Math.floor(a / gd.width);
        a %= gd.width;
    }
    let sq = b * gd.width + a;
    function line_d(x1: number, y1: number, dx: number, dy: number) {
        dx *= width_px;
        dy *= height_px;
        if (sd.flip_board) {
            dx *= -1;
            dy *= -1;
        }
        ctx[cid.board].beginPath();
        ctx[cid.board].moveTo(x1, y1);
        ctx[cid.board].lineTo(x1+dx, y1+dy);
        ctx[cid.board].stroke();
    };
    if (!gd.on_board(a, b)) { return; }
    if (["intersection", "xiangqi"].includes(sd.style.toLowerCase())) {
        let {x, y} = get_square_xy(container, a, b);
        x += width_px/2;
        y += width_px/2;
        ctx[cid.board].strokeStyle = 'black';
        ctx[cid.board].lineWidth = sd.lines*width_px;

        //Draw line from this point to the right
        if (container.gameData.on_board(a+1, b)) {
            line_d(x, y, 1, 0)
        }
        //Draw line down, if it's not a river
        if (gd.on_board(a, b+1) && (sd.style.toLowerCase() !== "xiangqi"
            || b+1 !== gd.height/2 || a === 0 || a === gd.width-1)) {
            line_d(x, y, 0, 1)
        }
        //Draw highlights
        if (gd.highlight.get(sq)) {
            let test = (offset: number) => { return gd.on_board(sq+offset) && gd.highlight.get(sq+offset); };
            //Top-left corner
            if (test(1) && test(gd.width) && !test(-1) && !test(-gd.width)) {
                line_d(x, y, 1, 1);
            }
            //Top-right corner
            if (!test(1) && test(gd.width) && test(-1) && !test(-gd.width)) {
                line_d(x, y, -1, 1);
            }
            //Bottom-left corner
            if (test(1) && !test(gd.width) && !test(-1) && test(-gd.width)) {
                line_d(x, y, 1, -1);
            }
            //Bottom-right corner
            if (!test(1) && !test(gd.width) && test(-1) && test(-gd.width)) {
                line_d(x, y, -1, -1);
            }
        }
        if (gd.highlight2.get(sq)) {
            //Draw intersections of isolated and highlighted points
            //Crosses
            if (sd.point_style.toLowerCase() === "x") {
                line_d(x - 0.2 * width_px, y - 0.2 * height_px, 0.4, 0.4);
                line_d(x + 0.2 * width_px, y - 0.2 * height_px, -0.4, 0.4);
            }
            //Dots
            else if (sd.point_style.toLowerCase() === "dot") {
                let x1 = sd.flip_board ? elemWidth(c[cid.board]) - x : x;
                let y1 = sd ? elemHeight(c[cid.board]) - y : y;
                ctx[cid.board].beginPath();
                ctx[cid.board].arc(x1, y1, width_px * 0.15, 0, 2 * Math.PI);
                ctx[cid.board].fillStyle = "black";
                ctx[cid.board].fill();
            }
            //4-corner
            else if (sd.point_style.toLowerCase() === "4-corner") {
                let length = 0.3, offset = 0.15;
                if (a > 0 && b > 0) {
                    line_d(x - offset * width_px, y - offset * height_px, -length, 0);
                    line_d(x - offset * width_px, y - offset * height_px, 0, -length);
                }
                if (a < gd.width - 1 && b > 0) {
                    line_d(x + offset * width_px, y - offset * height_px, length, 0);
                    line_d(x + offset * width_px, y - offset * height_px, 0, -length);
                }
                if (a > 0 && b < gd.height - 1) {
                    line_d(x - offset * width_px, y + offset * height_px, -length, 0);
                    line_d(x - offset * width_px, y + offset * height_px, 0, length);
                }
                if (a < gd.width - 1 && b < gd.height - 1) {
                    line_d(x + offset * width_px, y + offset * height_px, length, 0);
                    line_d(x + offset * width_px, y + offset * height_px, 0, length);
                }
            }
        }
    }
    else {
        let {x, y} = get_square_xy(container, a, b);
        let is_dark = (a + b + (sd.flip_colors?1:0)) % 2 && sd.style.toLowerCase() === "checkered";
        if (gd.highlight.get(sq) && sd.show_highlights && sd.style.toLowerCase() !== "ashtapada") {
            ctx[cid.board].fillStyle = is_dark ? sd.dark_highlight_col : sd.light_highlight_col;
            ctx[cid.board].fillRect(x, y, width_px, height_px);
        }
        else if (gd.highlight2.get(sq) && sd.show_highlights && sd.style.toLowerCase() !== "ashtapada") {
            ctx[cid.board].fillStyle = is_dark ? sd.dark_highlight_2_col : sd.light_highlight_2_col;
            ctx[cid.board].fillRect(x, y, width_px, height_px);
        }
        else {
            //Not a highlight, split up the square based on special squares
            let squares = [];
            if (gd.mud.get(sq)) squares.push(is_dark ? sd.dark_mud_col : sd.light_mud_col);
            if (gd.ethereal.get(sq)) squares.push(is_dark ? sd.dark_ethereal_col : sd.light_ethereal_col);
            if (gd.pacifist.get(sq)) squares.push(is_dark ? sd.dark_pacifist_col : sd.light_pacifist_col);
            if (gd.sanctuary.get(sq)) squares.push(is_dark ? sd.dark_sanctuary_col : sd.light_sanctuary_col);
            if (squares.length <= 1) {
                if (squares.length === 0) ctx[cid.board].fillStyle = is_dark ? sd.dark_square_col : sd.light_square_col;
                else ctx[cid.board].fillStyle = squares[0];
                ctx[cid.board].fillRect(x, y, width_px, height_px);
            }
            else if (squares.length === 2) {
                ctx[cid.board].fillStyle = squares[0];
                ctx[cid.board].fillRect(x, y, width_px/2, height_px);
                ctx[cid.board].fillStyle = squares[1];
                ctx[cid.board].fillRect(x+width_px/2, y, width_px/2, height_px);
            }
            else if (squares.length === 3) {
                ctx[cid.board].fillStyle = squares[0];
                ctx[cid.board].fillRect(x, y, width_px/2, height_px/2);
                ctx[cid.board].fillStyle = squares[1];
                ctx[cid.board].fillRect(x+width_px/2, y, width_px/2, height_px/2);
                ctx[cid.board].fillStyle = squares[2];
                ctx[cid.board].fillRect(x, y+height_px/2, width_px, height_px/2);
            }
            else {
                ctx[cid.board].fillStyle = squares[0];
                ctx[cid.board].fillRect(x, y, width_px/2, height_px/2);
                ctx[cid.board].fillStyle = squares[1];
                ctx[cid.board].fillRect(x+width_px/2, y, width_px/2, height_px/2);
                ctx[cid.board].fillStyle = squares[2];
                ctx[cid.board].fillRect(x, y+height_px/2, width_px/2, height_px/2);
                ctx[cid.board].fillStyle = squares[3];
                ctx[cid.board].fillRect(x+width_px/2, y+height_px/2, width_px/2, height_px/2);
            }
        }

        //X on highlighted ashtapada squares
        if (sd.style.toLowerCase() === "ashtapada" && gd.highlight.get(sq)) {
            line_d(x, y, 1, 1);
            line_d(x+width_px, y, -1, 1);
        }
        //Border
        if (sd.border) {
            ctx[cid.board].strokeStyle = 'black';
            ctx[cid.board].lineWidth = sd.border*width_px;
            ctx[cid.board].strokeRect(x, y, width_px, height_px);
        }
        //Square names
        if (sd.name_squares) {
            ctx[cid.board].font = "12px serif";
            ctx[cid.board].fillStyle = 'rgb(0,0,0)';
            ctx[cid.board].fillText(file(a) + rank(b, gd.height), x + 4, y + 12);
        }
    }
}

export function _render_all_spaces(container: GameContainer) {
    if (checkForBreak(container)) return;
    
    clear_layer(cid.board); //For some reason this is needed
    //Clear with background color
    ctx[cid.board].fillStyle = container.styleData.bg_col;
    ctx[cid.board].fillRect(0, 0, elemWidth(c[cid.board]), elemHeight(c[cid.board]));
    render_hands(container);
    //Draw the squares
    for (let a = 0; a < container.gameData.width; a++) {
        for (let b = 0; b < container.gameData.height; b++) {
            render_space(container, a, b);
        }
    }
}

function render_hands(container: GameContainer) {
    if (container.gameData.hasHand()) {
        ctx[cid.board].fillStyle = container.styleData.hand_col;
        ctx[cid.board].fillRect(0, 0, elemWidth(c[cid.board]), height_px);
        ctx[cid.board].fillRect(0, elemHeight(c[cid.board]) - height_px, elemWidth(c[cid.board]), height_px);
        //Hand border
        if (container.styleData.border) {
            ctx[cid.board].strokeStyle = 'black';
            ctx[cid.board].lineWidth = container.styleData.border * width_px;
            ctx[cid.board].strokeRect(0, 0, elemWidth(c[cid.board]), height_px);
            ctx[cid.board].strokeRect(0, elemHeight(c[cid.board]) - height_px, elemWidth(c[cid.board]), height_px);
        }
    }
}

//Returns top-left coordinate of the given square
//Can be called with one parameter
function get_square_xy(container: GameContainer, a: number, b?: number) {
    let gd = container.gameData;
    let has_hand = gd.hasHand() ? 1 : 0;
    if (b === undefined) {
        b = Math.floor(a / gd.width);
        a %= gd.width;
    }
    let x = width_px * a;
    let y = height_px * (b + has_hand);
    if (container.styleData.flip_board) {
        x = width_px * (gd.width - a - 1);
        y = height_px * (gd.height - b - 1 + has_hand);
    }
    return {x, y};
}

export function _render_glows(container: GameContainer) {
    if (checkForBreak(container)) return;
    
    let brd = container.boardHistory[container.viewMove];
    let sd = container.styleData;
    let gd = container.gameData;
    let cd = container.clickData;
    clear_layer(cid.glows);
    if (!["intersection, xiangqi"].includes(sd.style.toLowerCase())) {
        //Draw border around pieces that can move
        if (sd.movable_pieces && container.img_movable) {
            for (let a = 0; a < gd.width * gd.height; a ++) {
                if (!brd.can_move_ss[a].is_zero()) {
                    draw_on_square(container, cid.glows, container.img_movable, a);
                }
            }
        }
        //Attacked spaces
        if (sd.attacked_squares) {
            let scale = 0.2;
            for (let a = 0; a < gd.width * gd.height; a ++) {
                let {x, y} = get_square_xy(container, a);
                if (brd.white_attack_ss.get(a)) {
                    fill_triangle(cid.glows, x, y, x + width_px * scale, y, x, y + width_px * scale, 'white');
                }
                if (brd.black_attack_ss.get(a)) {
                    fill_triangle(cid.glows, x + width_px, y, x + width_px * (1 - scale), y, x + width_px, y + width_px * scale, 'black');
                }
            }
        }
    }
    //Draw glow on last moved piece
    if (sd.last_moved) {
        let img = container.img_glow;
        if (img) {
            if (brd.last_moved_src >= 0) {
                draw_on_square(container, cid.glows, img, brd.last_moved_src);
            }
            if (brd.last_moved_dest >= 0) {
                draw_on_square(container, cid.glows, img, brd.last_moved_dest);
            }
        }
    }
    //Draw glow on royals that can be landed on by opponent
    if (sd.check_indicator && container.img_glow_check) {
        draw_ss(container, cid.glows, brd.checked.black, container.img_glow_check);
        draw_ss(container, cid.glows, brd.checked.white, container.img_glow_check);
    }
}

function render_board_pieces(container: GameContainer) {
    let brd = container.boardHistory[container.viewMove];
    let gd = container.gameData;
    let sd = container.styleData;
    for (let a = 0; a < gd.all_pieces.length; a++) {
        let p = gd.all_pieces[a];
        let img = container.img_pieces.get(p.sprite);
        if (!img) continue;
        let neutral_pieces = ss_and(brd.white_ss, brd.black_ss, brd.piece_ss[a]);
        let white_pieces = ss_and(brd.white_ss, brd.black_ss.inverse(), brd.piece_ss[a]);
        let black_pieces = ss_and(brd.white_ss.inverse(), brd.black_ss, brd.piece_ss[a]);
        let flip_white = sd.rotate_opp &&  sd.flip_board;
        let flip_black = sd.rotate_opp && !sd.flip_board;
        let white_angle = (p.angle ?? 0) + (flip_white?180:0);
        let black_angle = (p.angle ?? 0) + (flip_black?180:0);
        draw_ss(container, cid.pieces, white_pieces, img, sd.white_col, false, white_angle, false, p.flip_sprite);
        draw_ss(container, cid.pieces, black_pieces, img, sd.black_col, false, black_angle, false, p.flip_sprite);
        draw_ss(container, cid.pieces, neutral_pieces, img, sd.neutral_col, false, p.angle, false, p.flip_sprite);
        if(p.mini_sprite) {
            img = container.img_pieces.get(p.mini_sprite);
            if (img) {
                draw_ss(container, cid.pieces, white_pieces, img, sd.white_col, true, white_angle, flip_white);
                draw_ss(container, cid.pieces, black_pieces, img, sd.black_col, true, black_angle, flip_black);
                draw_ss(container, cid.pieces, neutral_pieces, img, sd.neutral_col, true, p.angle);
            }
        }
    }
}

function render_hand_pieces(container: GameContainer) {
    let brd = container.boardHistory[container.viewMove];
    let gd = container.gameData;
    if (gd.hasHand()) {
        let hands = [brd.hands.white, brd.hands.black];
        for (let h = 0; h < hands.length; h ++) {
            let col = 0;
            for (let a = 0; a < hands[h].length; a++) {
                if (hands[h][a] > 0) {
                    let img = container.img_pieces.get(gd.all_pieces[a].sprite);
                    if (img) draw_on_hand(container, img, col, !!h, false, gd.all_pieces[a].angle, gd.all_pieces[a].flip_sprite);
                    let mini_sprite = gd.all_pieces[a].mini_sprite; //Have to separate it so the compiler doesn't complain
                    if (mini_sprite) {
                        img = container.img_pieces.get(mini_sprite);
                        if(img) draw_on_hand(container, img, col, !!h, true);
                    }
                    if (hands[h][a] > 1) {
                        draw_text_on_hand(container, String(hands[h][a]), col, !!h);
                    }
                    col++;
                }
            }
        }
    }
}

export function _render_pieces(container: GameContainer) {
    if (checkForBreak(container)) return;
    
    clear_layer(cid.pieces);
    render_board_pieces(container);
    render_hand_pieces(container);
}

export function _render_move_squares(container: GameContainer) {
    if (checkForBreak(container)) return;
    
    let brd = container.boardHistory[container.viewMove];
    let cd = container.clickData;
    let gd = container.gameData;
    clear_layer(cid.moves);
    if (brd.victory.val != -1) 
        return;
    //Draw the squares
    if (cd.hand_selected && container.img_sq_canmove_sel) {
        let drop_zone = cd.selected_side ?
            brd.can_drop_piece_to.black[cd.selected_position]:
            brd.can_drop_piece_to.white[cd.selected_position];
        draw_ss(container, cid.moves, drop_zone, container.img_sq_canmove_sel);
    }
    else if ((cd.selected || brd.is_piece_locked) && container.img_sq_canmove_sel) {
        let sq = brd.is_piece_locked ? brd.piece_locked_pos : cd.selected_position;
        draw_ss(container, cid.moves, brd.can_move_ss[sq], container.img_sq_canmove_sel);
    }
    else if(cd.down_sq != -1) {
        //Don't draw squares if we're drawing an arrow (except if it's already selected)
    }
    else if ((cd.mouseSqPos.y === -1 || cd.mouseSqPos.y === gd.height)) {
        let hover = highlighted_hand_piece(container);
        if(hover.piece != -1 && brd.slots_left(hover.piece, hover.color)) {
            let type = (hover.color === brd.turn) ? container.img_sq_canmove : container.img_sq_canmove_turn;
            if((!brd.turn && !container.localControl.white) || (brd.turn && !container.localControl.black)) 
                type = container.img_sq_canmove_turn;
            let drop_zone = hover.color ?
                brd.can_drop_piece_to.black[hover.piece]:
                brd.can_drop_piece_to.white[hover.piece];
            if(type) draw_ss(container, cid.moves, drop_zone, type);
        }
    }
    else {
        let highlight = cd.mouseSqPos.x + cd.mouseSqPos.y * gd.width;
        let color = (brd.black_ss.get(highlight) && brd.white_ss.get(highlight)) ? brd.turn : brd.black_ss.get(highlight);
        if (brd.can_move(color) && highlight >= 0 &&
            highlight < gd.width * gd.height) {
            let type = container.img_sq_canmove_turn;
            if ((!brd.turn && brd.white_ss.get(highlight)) || (brd.turn && brd.black_ss.get(highlight))) {
                type = container.img_sq_canmove;
            }
            if((!brd.turn && !container.localControl.white) || (brd.turn && !container.localControl.black))
                type = container.img_sq_canmove_turn;
            if(type) draw_ss(container, cid.moves, brd.can_move_ss[highlight], type);
        }
    }
    //Draw border around selected/hovered piece
    if (cd.down_sq === -1 && container.img_selected_hovered) {
        if (brd.is_piece_locked)
            draw_on_square(container, cid.moves, container.img_selected_hovered, brd.piece_locked_pos);
        else if (cd.selected)
            draw_on_square(container, cid.moves, container.img_selected_hovered, cd.selected_position);
        else {
            let isMyPiece = (brd.turn && brd.black_ss.get(cd.mouseSqPos.sq)) || (!brd.turn && brd.white_ss.get(cd.mouseSqPos.sq));
            if (isMyPiece && brd.can_move(brd.turn))
                draw_on_square(container, cid.moves, container.img_selected_hovered, cd.mouseSqPos.sq);
        }
    }
}

function fill_triangle(layer: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: string) {
    ctx[layer].fillStyle = color;
    ctx[layer].beginPath();
    ctx[layer].moveTo(x1, y1);
    ctx[layer].lineTo(x2, y2);
    ctx[layer].lineTo(x3, y3);
    ctx[layer].closePath();
    ctx[layer].fill();
}

function draw_tcr_arrow(container: GameContainer, x1: number, y1: number, x2: number, y2: number, col: string) {
    if (container.styleData.flip_board) {
        x1 = elemWidth(c[cid.arrows]) - x1;
        y1 = elemHeight(c[cid.arrows]) - y1;
        x2 = elemWidth(c[cid.arrows]) - x2;
        y2 = elemHeight(c[cid.arrows]) - y2;
    }
    let angle = Math.atan2(x2-x1, y2-y1);
    let angle3 = -Math.PI/2-angle+30*Math.PI/180;
    let angle4 = -Math.PI/2-angle-30*Math.PI/180;
    let x3 = Math.cos(angle3)*width_px*0.4 + x2;
    let y3 = Math.sin(angle3)*width_px*0.4 + y2;
    let x4 = Math.cos(angle4)*width_px*0.4 + x2;
    let y4 = Math.sin(angle4)*width_px*0.4 + y2;

    ctx[cid.arrows].strokeStyle = col;
    ctx[cid.arrows].lineCap = "round";
    ctx[cid.arrows].lineWidth = 0.1*width_px;
    ctx[cid.arrows].beginPath();
    ctx[cid.arrows].moveTo(x1, y1);
    ctx[cid.arrows].lineTo(x2, y2);
    ctx[cid.arrows].moveTo(x2, y2);
    ctx[cid.arrows].lineTo(x3, y3);
    ctx[cid.arrows].moveTo(x2, y2);
    ctx[cid.arrows].lineTo(x4, y4);
    ctx[cid.arrows].stroke();
}
function draw_tcr_circle(container: GameContainer, x: number, y: number, col: string) {
    if (container.styleData.flip_board) {
        x = elemWidth(c[cid.arrows]) - x;
        y = elemHeight(c[cid.arrows]) - y;
    }
    ctx[cid.arrows].strokeStyle = col;
    ctx[cid.arrows].lineWidth = 0.1*width_px;
    ctx[cid.arrows].beginPath();
    ctx[cid.arrows].arc(x, y, width_px * 0.4, 0, 2 * Math.PI);
    ctx[cid.arrows].stroke(); 
}

export function _render_circles_and_lines(container: GameContainer) {
    if (checkForBreak(container)) return;
    
    let gd = container.gameData;
    let cd = container.clickData;
    clear_layer(cid.arrows);
    for (let a = 0; a < container.circles.length; a ++) {
        let x = ((container.circles[a].sq % gd.width)+ 0.5) * width_px;
        let y = (Math.floor(container.circles[a].sq / gd.width) + 0.5) * height_px;
        if (gd.hasHand()) {
            y += height_px;
        }
        draw_tcr_circle(container, x, y, container.circles[a].col);
    }
    for (let a = 0; a < container.lines.length; a ++) {
        let x1 = ((container.lines[a].sq1 % gd.width)+ 0.5) * width_px;
        let y1 = (Math.floor(container.lines[a].sq1 / gd.width)+ 0.5) * height_px;
        let x2 = ((container.lines[a].sq2 % gd.width)+ 0.5) * width_px;
        let y2 = (Math.floor(container.lines[a].sq2 / gd.width) + 0.5) * height_px;
        if (gd.hasHand()) {
            y1 += height_px;
            y2 += height_px;
        }
        draw_tcr_arrow(container, x1, y1, x2, y2, container.lines[a].col);
    }
    if (cd.down_sq >= 0 && cd.down_sq < gd.width * gd.height) {
        let x = ((cd.down_sq % gd.width)+ 0.5) * width_px;
        let y = (Math.floor(cd.down_sq / gd.width) + 0.5) * height_px;
        if (gd.hasHand()) {
            y += height_px;
        }
        if (cd.down_sq === cd.mouseSqPos.sq) {
            draw_tcr_circle(container, x, y, container.line_col);
        }
        else if(cd.mouseSqPos.sq != -1) {
            let mx = ((cd.mouseSqPos.sq % gd.width)+ 0.5) * width_px;
            let my = (Math.floor(cd.mouseSqPos.sq / gd.width) + 0.5) * height_px;
            if (gd.hasHand()) {
                my += height_px;
            }
            draw_tcr_arrow(container, x, y, mx, my, container.line_col);
        }
    }
}

export function _render_promotion_menu(container: GameContainer) {
    if (checkForBreak(container)) return;
    
    let cd = container.clickData;
    clear_layer(cid.menu);
    if (cd.waiting_for_promotion) {
        //Background
        //ctx[cid.menu].globalAlpha = 0.5;
        ctx[cid.menu].fillStyle = 'rgba(0,0,0,0.5)';
        ctx[cid.menu].fillRect(0, 0, elemWidth(c[cid.menu]), elemHeight(c[cid.menu]));
        //ctx[cid.menu].globalAlpha = 1.0;
        //Border around selectable pieces
        let start_height = elemHeight(c[cid.menu]) / 2 - height_px / 2;
        let start_width = elemWidth(c[cid.menu]) / 2 - width_px * cd.promotions.length / 2;
        ctx[cid.menu].fillStyle = 'rgb(0,0,0)';
        let border_width = width_px / 8;
        ctx[cid.menu].fillRect(start_width - border_width, start_height - border_width,
            cd.promotions.length * width_px + border_width * 2, height_px + border_width * 2);

        //Selectable pieces
        let board = container.boardHistory[container.viewMove];
        let sd = container.styleData;
        for (let a = 0; a < cd.promotions.length; a++) {
            ctx[cid.menu].fillStyle = (a % 2) ? container.styleData.dark_square_col : container.styleData.light_square_col;
            ctx[cid.menu].fillRect(start_width + width_px * a, start_height, width_px, height_px);
            let p = container.gameData.all_pieces[cd.promotions[a]];
            let img = container.img_pieces.get(p.sprite);
            let angle = p.angle + ((sd.rotate_opp && board.turn) ? 180 : 0);
            if(img) draw_sprite(container, cid.menu, img, start_width + width_px * a, start_height, width_px, height_px,
                board.turn ? sd.black_col : sd.white_col, angle, p.flip_sprite);
        }
    }
}

export function highlighted_hand_piece(c: GameContainer) {
    let board = c.boardHistory[c.viewMove];
    let hover_side = (c.clickData.mouseSqPos.y === -1);
    let real_mouse_x = c.styleData.flip_board ? (c.gameData.width - c.clickData.mouseSqPos.x - 1) : c.clickData.mouseSqPos.x;
    let this_hand = hover_side ? board.hands.black : board.hands.white;
    let col = 0; //column
    let hover_piece = -1;
    for (let a = 0; a < this_hand.length; a++) {
        if (this_hand[a] > 0) {
            if (col === real_mouse_x) {
                hover_piece = a;
            }
            col++;
        }
    }
    return {piece: hover_piece, color: hover_side};
}

function draw_sprite(container: GameContainer, layer: number, sprite: CanvasImageSource, x: number, y: number, width: number, height: number, color?: string, angle = 0, flipped = false) {
    ctx[layer].translate(x + width / 2, y + height / 2);
    ctx[layer].rotate(angle * Math.PI / 180);
    if (flipped) {
        ctx[layer].scale(-1,1);
    }

    if (!color || color === 'rgb(255,255,255)') {
        ctx[layer].drawImage(sprite, -width / 2, -height / 2, width, height);
    }
    else if (!container.blend_canvas) {
        console.error("No blend canvas detected. Please define a blend canvas to draw colored images");
        ctx[layer].drawImage(sprite, -width / 2, -height / 2, width, height);
    }
    else {
        let ctx2 = container.blend_canvas.getContext("2d");
        if(!ctx2) return;
        ctx2.clearRect(0, 0, container.blend_canvas.width, container.blend_canvas.height);
        ctx2.drawImage(sprite, 0, 0, width, height);
        ctx2.globalCompositeOperation = "multiply";
        ctx2.fillStyle = color;
        ctx2.fillRect(0, 0, width, height);
        ctx2.globalCompositeOperation = "destination-in";
        ctx2.drawImage(sprite, 0, 0, width, height);
        ctx2.globalCompositeOperation = "source-over";
        //Nothing besides piece sprites will be colored
        ctx[layer].drawImage(container.blend_canvas, 0, 0, width, height, -width / 2, -height / 2, width, height);
    }

    ctx[layer].setTransform(1, 0, 0, 1, 0, 0);
}
export function _print_history(container: GameContainer) {
    let total = "";
    let num = 1, row = "";
    for (let a = 0; a < container.moveHistory.length; a++) {
        if (container.moveHistory[a].turn != num) {
            total += row+"\n";
            num++;
            row = "";
        }
        row += container.moveHistory[a].notation;
        if(a < container.moveHistory.length - 1 && container.moveHistory[a+1].turn == num) {
            row += "\t";
        }
    }
    if (row != "") {
        total += row+"\n";
        num++;
        row = "";
    }
    console.log(total);
}

function draw_on_square(container: GameContainer, layer: number, img: CanvasImageSource, pos1: number, pos2?: number) {
    let {x: pos_x, y: pos_y} = get_square_xy(container, pos1, pos2);
    draw_sprite(container, layer, img, pos_x, pos_y, width_px, height_px);
}

function draw_on_hand(container: GameContainer, img: CanvasImageSource, x: number, is_black: boolean, is_mini = false, angle = 0, flipped = false) {
    let sd = container.styleData;
    let side = sd.flip_board ? !is_black : is_black;
    //Find x and y coordinates
    let pos_x = x * width_px;
    let pos_y = side ? 0 : elemHeight(c[cid.pieces]) - height_px;
    let width = is_mini ? width_px * 0.4 : width_px;
    let height = is_mini ? height_px * 0.4 : height_px;
    draw_sprite(container, cid.pieces, img, pos_x, pos_y, width, height, is_black ? sd.black_col : sd.white_col, angle, flipped);
}

function draw_text_on_hand(container: GameContainer, txt: string, x: number, is_black: boolean) {
    if (container.styleData.flip_board) { is_black = !is_black; }
    //Find x and y coordinates
    let pos_x = x * width_px;
    let pos_y = is_black ? 0 : elemHeight(c[cid.pieces]) - height_px;
    ctx[cid.pieces].font = "12px serif";
    ctx[cid.pieces].fillStyle = 'rgb(0,0,0)';
    ctx[cid.pieces].fillText(txt, pos_x + 4, pos_y + 12);
}

function draw_ss(container: GameContainer, layer: number, ss: Squareset, img: CanvasImageSource, //Mandatory
    col?: string, is_mini: boolean = false, angle: number = 0, is_flip: boolean = false, flip_sprite: boolean = false) { //Optional

    let gd = container.gameData;
    let width_px = elemWidth(c[layer]) / gd.width;
    let height_px = elemHeight(c[layer]) / (gd.height + (gd.hasHand() ? 2 : 0));
    for (let a = 0; a < Math.min(ss.length, gd.width * gd.height); a++) {
        if (ss.get(a)) {
            let {x: pos_x, y: pos_y} = get_square_xy(container, a);
            const mini_ratio = 0.4;
            let width = is_mini ? width_px * mini_ratio : width_px;
            let height = is_mini ? height_px * mini_ratio : height_px;
            if (is_mini && is_flip) {
                pos_x += width_px  * (1 - mini_ratio);
                pos_y += height_px * (1 - mini_ratio);
            }
            draw_sprite(container, layer, img, pos_x, pos_y, width, height, col, angle, flip_sprite);
        }
    }
}
