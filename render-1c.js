﻿let c, ctx, width_px, height_px, square_x, square_y;
function reload_variables() {
    c = document.getElementById("board_canvas");
    ctx = c.getContext("2d");
    width_px = c.width / game_data.width; //Width and height should be the same
    height_px = c.height / (game_data.height + (game_data.has_hand ? 2 : 0));
    square_x = mouse_sq_pos.x;
    square_y = mouse_sq_pos.y;
}

function render_board(){
    if (!game_data || !game_data.width) {
        return;
    }

    let brd = board_history[view_move];
    if (brd === undefined) {
        return;
    }

    reload_variables();

    //Clear with background color
    ctx.fillStyle = style_data.bg_col;
    ctx.fillRect(0, 0, c.width, c.height);

    //Draw the squares
    for (let a = 0; a < game_data.width; a++) {
        for (let b = 0; b < game_data.height; b++) {
            render_space(a, b);
        }
    }
    //Hands
    if (game_data.has_hand) {
        ctx.fillStyle = style_data.hand_col;
        ctx.fillRect(0, 0, c.width, height_px);
        ctx.fillRect(0, c.height-height_px, c.width, height_px);
        //Hand border
        if (style_data.border) {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = style_data.border*width_px;
            ctx.strokeRect(0, 0, c.width, height_px);
            ctx.strokeRect(0, c.height-height_px, c.width, height_px);
        }
    }

    //Draw glow on last moved piece
    if (style_data.last_moved) {
        let img = document.getElementById("img_glow");
        if (brd.last_moved_src >= 0) {
            draw_on_square(img, brd.last_moved_src);
        }
        if (brd.last_moved_dest >= 0) {
            draw_on_square(img, brd.last_moved_dest);
        }
    }
    //Draw glow on royals that can be landed on by opponent
    if (style_data.check_indicator) {
        draw_ss(brd.checked.black, document.getElementById("img_glow_check"));
        draw_ss(brd.checked.white, document.getElementById("img_glow_check"));
    }

    //Draw the pieces
    for (let a = 0; a < game_data.all_pieces.length; a++) {
        let p = game_data.all_pieces[a];
        let img = document.getElementById("img_" + p.sprite);
        let neutral_pieces = ss_and(brd.white_ss, brd.black_ss, brd.piece_ss[a]);
        let white_pieces = ss_and(brd.white_ss, brd.black_ss.inverse(), brd.piece_ss[a]);
        let black_pieces = ss_and(brd.white_ss.inverse(), brd.black_ss, brd.piece_ss[a]);
        let flip_white = style_data.rotate_opp &&  style_data.flip_board;
        let flip_black = style_data.rotate_opp && !style_data.flip_board;
        let white_angle = (p.angle ?? 0) + flip_white*180;
        let black_angle = (p.angle ?? 0) + flip_black*180;
        draw_ss(white_pieces, img, style_data.white_col, false, white_angle);
        draw_ss(black_pieces, img, style_data.black_col, false, black_angle);
        draw_ss(neutral_pieces, img, style_data.neutral_col, false, p.angle);
        if(p.mini_sprite != undefined) {
            img = document.getElementById("img_" + p.mini_sprite);
            draw_ss(white_pieces, img, style_data.white_col, true, white_angle, flip_white);
            draw_ss(black_pieces, img, style_data.black_col, true, black_angle, flip_black);
            draw_ss(neutral_pieces, img, style_data.neutral_col, true, p.angle);
        }
    }
    draw_circles_and_lines();

    //Pieces in hand
    if (game_data.has_hand) {
        let col = 0;
        for (let a = 0; a < brd.hands.white.length; a++) {
            if (brd.hands.white[a] > 0) {
                let img = document.getElementById("img_" + game_data.all_pieces[a].sprite)
                draw_on_hand(img, col, false);
                if (game_data.all_pieces[a].mini_sprite) {
                    img = document.getElementById("img_" + game_data.all_pieces[a].mini_sprite);
                    draw_on_hand(img, col, false, true);
                }
                if (brd.hands.white[a] > 1) {
                    draw_text_on_hand(brd.hands.white[a], col, false);
                }
                col++;
            }
        }
        col = 0;
        for (let a = 0; a < brd.hands.black.length; a++) {
            if (brd.hands.black[a] > 0) {
                let img = document.getElementById("img_" + game_data.all_pieces[a].sprite)
                draw_on_hand(img, col, true);
                if (game_data.all_pieces[a].mini_sprite) {
                    img = document.getElementById("img_" + game_data.all_pieces[a].mini_sprite);
                    draw_on_hand(img, col, true, true);
                }
                if (brd.hands.black[a] > 1) {
                    draw_text_on_hand(brd.hands.black[a], col, true);
                }
                col++;
            }
        }
    }

    //Draw squares indicating possible moves
    if (brd.victory === -1) {
        if (temp_data.hand_selected) {
            let drop_zone = temp_data.selected_side ?
                board.can_drop_piece_to.black[temp_data.selected_position]:
                board.can_drop_piece_to.white[temp_data.selected_position];
            draw_ss(drop_zone, document.getElementById('img_sq_canmove_sel'));
        }
        else if (temp_data.selected) {
            draw_ss(brd.can_move_ss[temp_data.selected_position], document.getElementById('img_sq_canmove_sel'));
        }
        else if(down_sq != -1) {
            //Don't draw squares if we're drawing an arrow (except if it's already selected)
        }
        else if ((mouse_sq_pos.y === -1 || mouse_sq_pos.y === game_data.height)) {
            let hover = highlighted_hand_piece(brd);
            if(hover.piece != -1 && slots_left(hover.piece, hover.color, brd)) {
                let type = (hover.color === brd.turn) ? 'img_sq_canmove' : 'img_sq_canmove_turn';
                if(in_multiplayer_game &&  brd.turn != my_col) { type = 'img_sq_canmove_turn'; }
                let drop_zone = hover.color ?
                    board.can_drop_piece_to.black[hover.piece]:
                    board.can_drop_piece_to.white[hover.piece];
                draw_ss(drop_zone, document.getElementById(type));
            }
        }
        else {
            let highlight = square_x + square_y * game_data.width;
            let color = (brd.black_ss.get(highlight) && brd.white_ss.get(highlight)) ? brd.turn : board.black_ss.get(highlight);
            if (can_move(color, brd) && highlight >= 0 &&
                highlight < game_data.width * game_data.height) {
                let type = 'img_sq_canmove_turn';
                if ((!brd.turn && brd.white_ss.get(highlight)) || (brd.turn && brd.black_ss.get(highlight))) {
                    type = 'img_sq_canmove';
                }
                if(in_multiplayer_game &&  brd.turn != my_col) { type = 'img_sq_canmove_turn'; }
                draw_ss(brd.can_move_ss[highlight], document.getElementById(type));
            }
        }
    }

    //Promotions menu
    if (temp_data.waiting_for_promotion) {
        draw_promotion_menu();
    }
}

//Just the background, not including pieces, glows, etc.
function render_space(a, b) {
    //Can be called with only one parameter
    if (b === undefined) {
        b = Math.floor(a / game_data.width);
        a %= game_data.width;
    }
    let sq = b * game_data.width + a;
    function line_d(x1, y1, dx, dy) {
        dx *= width_px;
        dy *= height_px;
        if (style_data.flip_board) {
            dx *= -1;
            dy *= -1;
            x1 = c.width - x1;
            y1 = c.height - y1;
        }
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1+dx, y1+dy);
        ctx.stroke();
    };
    if (!on_board(a, b)) { return; }
    if (["intersection", "xiangqi"].includes(style_data.style.toLowerCase())) {
        let x = (a + 0.5) * width_px;
        let y = (b + 0.5 + game_data.has_hand) * height_px;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = style_data.lines*width_px;

        //Draw line from this point to the right
        if (on_board(a+1, b)) {
            line_d(x, y, 1, 0)
        }
        //Draw line down, if it's not a river
        if (on_board(a, b+1) && (style_data.style.toLowerCase() !== "xiangqi"
            || b+1 !== game_data.height/2 || a === 0 || a === game_data.width-1)) {
            line_d(x, y, 0, 1)
        }
        //Draw highlights
        if (game_data.highlight.get(sq)) {
            let test = offset => { return on_board(sq+offset) && game_data.highlight.get(sq+offset); };
            //Top-left corner
            if (test(1) && test(game_data.width) && !test(-1) && !test(-game_data.width)) {
                line_d(x, y, 1, 1);
            }
            //Top-right corner
            if (!test(1) && test(game_data.width) && test(-1) && !test(-game_data.width)) {
                line_d(x, y, -1, 1);
            }
            //Bottom-left corner
            if (test(1) && !test(game_data.width) && !test(-1) && test(-game_data.width)) {
                line_d(x, y, 1, -1);
            }
            //Bottom-right corner
            if (!test(1) && !test(game_data.width) && test(-1) && test(-game_data.width)) {
                line_d(x, y, -1, -1);
            }
        }
        if (game_data.highlight2.get(sq)) {
            //Draw intersections of isolated and highlighted points
            //Crosses
            if (style_data.point_style.toLowerCase() === "x") {
                line_d(x - 0.2 * width_px, y - 0.2 * height_px, 0.4, 0.4);
                line_d(x + 0.2 * width_px, y - 0.2 * height_px, -0.4, 0.4);
            }
            //Dots
            else if (style_data.point_style.toLowerCase() === "dot") {
                let x1 = style_data.flip_board ? c.width - x : x;
                let y1 = style_data.flip_board ? c.height - y : y;
                ctx.beginPath();
                ctx.arc(x1, y1, width_px * 0.15, 0, 2 * Math.PI);
                ctx.fillStyle = "black";
                ctx.fill();
            }
            //4-corner
            else if (style_data.point_style.toLowerCase() === "4-corner") {
                let length = 0.3, offset = 0.15;
                if (a > 0 && b > 0) {
                    line_d(x - offset * width_px, y - offset * height_px, -length, 0);
                    line_d(x - offset * width_px, y - offset * height_px, 0, -length);
                }
                if (a < game_data.width - 1 && b > 0) {
                    line_d(x + offset * width_px, y - offset * height_px, length, 0);
                    line_d(x + offset * width_px, y - offset * height_px, 0, -length);
                }
                if (a > 0 && b < game_data.height - 1) {
                    line_d(x - offset * width_px, y + offset * height_px, -length, 0);
                    line_d(x - offset * width_px, y + offset * height_px, 0, length);
                }
                if (a < game_data.width - 1 && b < game_data.height - 1) {
                    line_d(x + offset * width_px, y + offset * height_px, length, 0);
                    line_d(x + offset * width_px, y + offset * height_px, 0, length);
                }
            }
        }
    }
    else {
        let is_dark = (a + b + style_data.flip_colors) % 2 && style_data.style.toLowerCase() === "checkered";
        if (game_data.highlight.get(sq) && style_data.show_highlights && style_data.style.toLowerCase() !== "ashtapada")
            { ctx.fillStyle = is_dark ? style_data.dark_highlight_col : style_data.light_highlight_col; }
        else if (game_data.highlight2.get(sq) && style_data.show_highlights && style_data.style.toLowerCase() !== "ashtapada")
            { ctx.fillStyle = is_dark ? style_data.dark_highlight_2_col : style_data.light_highlight_2_col; }
        else if (game_data.mud.get(sq)) { ctx.fillStyle = is_dark ? style_data.dark_mud_col : style_data.light_mud_col; }
        else if (game_data.ethereal.get(sq)) { ctx.fillStyle = is_dark ? style_data.dark_ethereal_col : style_data.light_ethereal_col; }
        else if (game_data.pacifist.get(sq)) { ctx.fillStyle = is_dark ? style_data.dark_pacifist_col : style_data.light_pacifist_col; }
        else if (game_data.sanctuary.get(sq)) { ctx.fillStyle = is_dark ? style_data.dark_sanctuary_col : style_data.light_sanctuary_col; }
        else { ctx.fillStyle = is_dark ? style_data.dark_square_col : style_data.light_square_col; }
        let x = width_px * a, y = height_px * (b + game_data.has_hand)
        if (style_data.flip_board) {
            x = width_px * (game_data.width - a - 1);
            y = height_px * (game_data.height - b - 1 + game_data.has_hand);
        }
        ctx.fillRect(x, y, width_px, height_px);

        //X on highlighted ashtapada squares
        if (style_data.style.toLowerCase() === "ashtapada" && game_data.highlight.get(sq)) {
            line_d(x, y, 1, 1);
            line_d(x+width_px, y, -1, 1);
        }

        //Draw border around pieces that can move
        if (style_data.movable_pieces) {
            if(!brd.can_move_ss[sq].is_zero()) {
                draw_on_square(document.getElementById("img_movable"), sq);
            }
        }
        //Attacked spaces
        if (style_data.attacked_squares) {
            let scale = 0.2;
            if(board.white_attack_ss.get(sq)) {
                fill_triangle(x, y, x+width_px*scale, y, x, y+width_px*scale, 'white');
            }
            if(board.black_attack_ss.get(sq)) {
                fill_triangle(x+width_px, y, x+width_px*(1-scale), y, x+width_px, y+width_px*scale, 'black');
            }
        }
        //Border
        if (style_data.border) {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = style_data.border*width_px;
            ctx.strokeRect(x, y, width_px, height_px);
        }
        //Square names
        if (style_data.name_squares) {
            ctx.font = "12px serif";
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.fillText(file(a) + rank(b), x + 4, y + 12);
        }
    }
}

function fill_triangle(x1, y1, x2, y2, x3, y3, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
}

function draw_tcr_arrow(x1, y1, x2, y2, col) {
    if (style_data.flip_board) {
        x1 = canvas.width - x1;
        y1 = canvas.height - y1;
        x2 = canvas.width - x2;
        y2 = canvas.height - y2;
    }
    let angle = Math.atan2(x2-x1, y2-y1);
    let angle3 = -Math.PI/2-angle+30*Math.PI/180;
    let angle4 = -Math.PI/2-angle-30*Math.PI/180;
    let x3 = Math.cos(angle3)*width_px*0.4 + x2;
    let y3 = Math.sin(angle3)*width_px*0.4 + y2;
    let x4 = Math.cos(angle4)*width_px*0.4 + x2;
    let y4 = Math.sin(angle4)*width_px*0.4 + y2;

    ctx.strokeStyle = col;
    ctx.lineCap = "round";
    ctx.lineWidth = 0.1*width_px;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.moveTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.moveTo(x2, y2);
    ctx.lineTo(x4, y4);
    ctx.stroke();
}
function draw_tcr_circle(x, y, col) {
    if (style_data.flip_board) {
        x = canvas.width - x;
        y = canvas.height - y;
    }
    ctx.strokeStyle = col;
    ctx.lineWidth = 0.1*width_px;
    ctx.beginPath();
    ctx.arc(x, y, width_px * 0.4, 0, 2 * Math.PI);
    ctx.stroke(); 
}

function draw_circles_and_lines() {
    for (let a = 0; a < circles.length; a ++) {
        let x = ((circles[a].sq % game_data.width)+ 0.5) * width_px;
        let y = (Math.floor(circles[a].sq / game_data.width) + 0.5) * height_px;
        if (game_data.has_hand) {
            y += height_px;
        }
        draw_tcr_circle(x, y, circles[a].col);
    }
    for (let a = 0; a < lines.length; a ++) {
        let x1 = ((lines[a].sq1 % game_data.width)+ 0.5) * width_px;
        let y1 = (Math.floor(lines[a].sq1 / game_data.width)+ 0.5) * height_px;
        let x2 = ((lines[a].sq2 % game_data.width)+ 0.5) * width_px;
        let y2 = (Math.floor(lines[a].sq2 / game_data.width) + 0.5) * height_px;
        if (game_data.has_hand) {
            y1 += height_px;
            y2 += height_px;
        }
        draw_tcr_arrow(x1, y1, x2, y2, lines[a].col);
    }
    if (down_sq >= 0 && down_sq < game_data.width * game_data.height) {
        let x = ((down_sq % game_data.width)+ 0.5) * width_px;
        let y = (Math.floor(down_sq / game_data.width) + 0.5) * height_px;
        if (game_data.has_hand) {
            y += height_px;
        }
        if (down_sq === mouse_sq) {
            draw_tcr_circle(x, y, line_col);
        }
        else if(mouse_sq != -1) {
            let mx = ((mouse_sq % game_data.width)+ 0.5) * width_px;
            let my = (Math.floor(mouse_sq / game_data.width) + 0.5) * height_px;
            if (game_data.has_hand) {
                my += height_px;
            }
            draw_tcr_arrow(x, y, mx, my, line_col);
        }
    }
}

function draw_promotion_menu() {
    //Background
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.globalAlpha = 1.0;
    //Border around selectable pieces
    let start_height = c.height / 2 - height_px / 2;
    let start_width = c.width / 2 - height_px * temp_data.promotions.length / 2;
    ctx.fillStyle = 'rgb(0,0,0)';
    let border_width = width_px / 8;
    ctx.fillRect(start_width - border_width, start_height - border_width,
        temp_data.promotions.length * width_px + border_width * 2, height_px + border_width * 2);

    //Selectable pieces
    for (let a = 0; a < temp_data.promotions.length; a++) {
        ctx.fillStyle = (a % 2) ? style_data.dark_square_col : style_data.light_square_col;
        ctx.fillRect(start_width + width_px * a, start_height, width_px, height_px);
        let img = document.getElementById("img_" + game_data.all_pieces[temp_data.promotions[a]].sprite);
        //To do: Set draw color based on piece's color
        draw_sprite(img, start_width + width_px * a, start_height, width_px, height_px);
    }
}

function can_move(color, brd) {
    if(brd === undefined) {
        brd = board;
    }
    //If game_data.force_drop and you have pieces in your hand, you can't move normally
    if (game_data.force_drop && game_data.has_hand) {
        if ((color && board.can_drop.black) || (!color && board.can_drop.white)) {
            return false;
        }
        /*let my_hand = color ? board.hands.black : board.hands.white;
        if(color ? board.can_drop.black : board.can_drop.white) {
            for (let a = 0; a < my_hand.length; a ++) {
                if (my_hand[a] > 0) {
                    return false;
                }
            }
        }*/
    }
    return true;
}

function highlighted_hand_piece(brd) {
    if(brd === undefined) {
        brd = board;
    }
    let hover_side = (mouse_sq_pos.y === -1);
    let real_mouse_x = style_data.flip_board ? (game_data.width - mouse_sq_pos.x - 1) : mouse_sq_pos.x;
    let this_hand = hover_side ? brd.hands.black : brd.hands.white;
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

function draw_sprite(sprite, x, y, width, height, color, angle = 0) {
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(angle * Math.PI / 180);

    if (!color || color === 'rgb(255,255,255)') {
        ctx.drawImage(sprite, -width / 2, -height / 2, width, height);
    }
    else {
        let c2 = document.getElementById("blend_canvas");
        let ctx2 = c2.getContext("2d");
        ctx2.clearRect(0, 0, c2.width, c2.height);
        ctx2.drawImage(sprite, 0, 0, width, height);
        ctx2.globalCompositeOperation = "multiply";
        ctx2.fillStyle = color;
        ctx2.fillRect(0, 0, width, height);
        ctx2.globalCompositeOperation = "destination-in";
        ctx2.drawImage(sprite, 0, 0, width, height);
        ctx2.globalCompositeOperation = "source-over";
        //Nothing besides piece sprites will be colored
        ctx.drawImage(c2, 0, 0, width, height, -width / 2, -height / 2, width, height);
    }

    ctx.rotate(-angle * Math.PI / 180);
    ctx.translate(-x - width / 2, -y - height / 2);
}

function render_extras() {
    //Turn indicator
    let ti = document.getElementById("turn_indicator");
    ti.innerHTML = board_history[view_move].turn ? "Turn: Black" : "Turn: White";
    //Win indicator
    if (board_history[view_move].victory != -1) {
        switch (board_history[view_move].victory) {
            case 0:
            case false:
                ti.innerHTML += "; Winner: White";
                break;
            case 0.5:
                ti.innerHTML += "; Winner: Draw";
                break;
            case 1:
            case true:
                ti.innerHTML += "; Winner: Black";
                break;
        }
    }

    //Name, Author, Description
    document.getElementById("board_name_header").innerHTML = DOMPurify.sanitize(game_data.name);
    let desc_elem = document.getElementById("board_description_header"), show_desc = !!game_data.description;
    let author_elem = document.getElementById("board_author_header"), show_author = !!game_data.author;
    desc_elem.innerHTML = show_desc ? DOMPurify.sanitize(game_data.description) : "No description";
    desc_elem.style.display = show_desc ? "block" : "none";
    author_elem.innerHTML = show_author ? DOMPurify.sanitize("Author: "+game_data.author) : "No author";
    author_elem.style.display = show_author ? "block" : "none";

    //Move history
    let hist_div = document.getElementById("move_history");
    hist_div.innerHTML = "";
    /*
    let move_to_string = (move) => {
        return "" + file(move.x1) + rank(move.y1) + "→" + file(move.x2) + rank(move.y2);
    };*/
    let num = 1, row = "";
    for (let a = 0; a < move_history.length; a++) {
        if (move_history[a].turn != num) {
            hist_div.innerHTML += DOMPurify.sanitize("<p>" + num + " - " + row + "</p>");
            num++;
            row = "";
        }
        let inner_p = move_history[a].notation;//move_to_string(move_history[a]);
        if (a === view_move - 1) {
            inner_p = "<b>" + inner_p + "</b>";
        }
        row += inner_p;
        if(a < move_history.length - 1 && move_history[a+1].turn == num) {
            row += "&emsp;";
        }
    }
    if (row != "") {
        hist_div.innerHTML += DOMPurify.sanitize("<p>" + num + " - " + row + "</p>");
        num++;
        row = "";
    }

    //Multiplayer stuff
    if (in_multiplayer_game) {
        document.getElementById("multiplayer_label").innerHTML = "Mode: Multi-player";
        if(my_name != undefined && opp_name != undefined) {
            let white_name = "White: " + (my_col ? opp_name : my_name);
            let black_name = "Black: " + (my_col ? my_name : opp_name);
            document.getElementById("top_player_label").style.display = "block";
            document.getElementById("bottom_player_label").style.display = "block";
            document.getElementById("top_player_label").innerHTML = DOMPurify.sanitize(style_data.flip_board ? white_name : black_name);
            document.getElementById("bottom_player_label").innerHTML = DOMPurify.sanitize(style_data.flip_board ? black_name : white_name);
        }
        else {
            document.getElementById("top_player_label").style.display = "none";
            document.getElementById("bottom_player_label").style.display = "none";
        }
        document.getElementById("choose_section").style.display = "none";
        document.getElementById("resign_btn").style.display = "block";
    }
    else {
        document.getElementById("multiplayer_label").innerHTML = "Mode: Single-player";
        document.getElementById("top_player_label").style.display = "none";
        document.getElementById("bottom_player_label").style.display = "none";
        document.getElementById("choose_section").style.display = "block";
        document.getElementById("resign_btn").style.display = "none";
    }

    //Upload button
    if (loaded_from_file) {
        document.getElementById("upload_div").style.display = "block";
    }
    else {
        document.getElementById("upload_div").style.display = "none";
    }
}
function print_history() {
    let total = "";
    let num = 1, row = "";
    for (let a = 0; a < move_history.length; a++) {
        if (move_history[a].turn != num) {
            total += row+"\n";
            num++;
            row = "";
        }
        row += move_history[a].notation;
        if(a < move_history.length - 1 && move_history[a+1].turn == num) {
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

function draw_on_square(img, pos1, pos2) {
    //If only sq position is given, set square based on that
    let sq = pos1;
    //If x and y coords are given, set square based on that
    if (pos2 != undefined) {
        sq = pos2 * game_data.width * pos1;
    }
    //Set size data
    let width_px = canvas.width / game_data.width;
    let height_px = canvas.height / (game_data.height + (game_data.has_hand ? 2 : 0));
    //Find x and y coordinates, depending on if the board is flipped
    let pos_x = width_px * (sq % game_data.width);
    let pos_y = height_px * (Math.floor(sq / game_data.width) + game_data.has_hand);
    if (style_data.flip_board) {
        pos_x = width_px * (game_data.width - (sq % game_data.width) - 1);
        pos_y = height_px * (game_data.height - Math.floor(sq / game_data.width) - 1 + game_data.has_hand);
    }
    draw_sprite(img, pos_x, pos_y, width_px, height_px);
}

function draw_on_hand(img, x, is_black, is_mini = false) {
    let side = style_data.flip_board ? !is_black : is_black;
    //Set size data
    let width_px = canvas.width / game_data.width;
    let height_px = canvas.height / (game_data.height + (game_data.has_hand ? 2 : 0));
    //Find x and y coordinates
    let pos_x = x * width_px;
    let pos_y = side ? 0 : canvas.height - height_px;
    let width = is_mini ? width_px * 0.4 : width_px;
    let height = is_mini ? height_px * 0.4 : height_px;
    draw_sprite(img, pos_x, pos_y, width, height, is_black ? style_data.black_col : style_data.white_col);
}

function draw_text_on_hand(txt, x, is_black) {
    if (style_data.flip_board) { is_black ^= 1; }
    //Set size data
    let width_px = canvas.width / game_data.width;
    let height_px = canvas.height / (game_data.height + (game_data.has_hand ? 2 : 0));
    //Find x and y coordinates
    let pos_x = x * width_px;
    let pos_y = is_black ? 0 : canvas.height - height_px;
    ctx.font = "12px serif";
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillText(txt, pos_x + 4, pos_y + 12);
}

function draw_ss(ss, img, col, is_mini = false, angle = 0, is_flip = false) {
    let width_px = canvas.width / game_data.width;
    let height_px = canvas.height / (game_data.height + (game_data.has_hand ? 2 : 0));
    for (let a = 0; a < Math.min(ss.length, game_data.width * game_data.height); a++) {
        if (ss.get(a)) {
            let pos_x = width_px * (a % game_data.width);
            let pos_y = height_px * (Math.floor(a / game_data.width) + game_data.has_hand);
            if (style_data.flip_board) {
                pos_x = width_px * (game_data.width - (a % game_data.width) - 1);
                pos_y = height_px * (game_data.height - Math.floor(a / game_data.width) - 1 + game_data.has_hand);
            }
            const mini_ratio = 0.4;
            let width = is_mini ? width_px * mini_ratio : width_px;
            let height = is_mini ? height_px * mini_ratio : height_px;
            if (is_mini && is_flip) {
                pos_x += width_px  * (1 - mini_ratio);
                pos_y += height_px * (1 - mini_ratio);
            }
            draw_sprite(img, pos_x, pos_y, width, height, col, angle);
        }
    }
}

function print_ss(ss, width) {
    let ret = "";
    if (width === undefined) {
        width = game_data.width;
    }
    for (let a = 0; a < ss.length; a++) {
        ret += ss.get(a) ? "1" : "0";
        if ((a + 1) % width === 0) {
            ret += "\n";
        }
    }
    console.log(ret)
} 

function export_history() {
    let code = game_data.code ?? game_data.name.toLowerCase();
    let ret = code + "," + game_data.seed;
    for (let a = 0; a < move_history.length; a++) {
        if (move_history[a].drop) {
            ret += "[" + move_history[a].piece + "," + Number(move_history[a].color) + "," + move_history[a].dest + "]";
        }
        else {
            let prom = move_history[a].promotion === undefined ? "" : "," + move_history[a].promotion;
            ret += "[" + move_history[a].x1 + "," + move_history[a].y1 + "," + move_history[a].x2 + "," + move_history[a].y2 + prom + "]";
        }
    }
    return ret;
} 
function import_history(history) {
    for (let a = 0; a < history.length; a++) {
        if (history[a] === "[") {
            //Find the closing bracket
            let end = a;
            while (history[end] != "]") {
                end++;
            }
            //Read the four numbers
            let nums = history.substr(a + 1, end - a - 1).split(",");
            for (let a = 0; a < nums.length; a++) {
                nums[a] = Number(nums[a]);
            }
            if (nums.length === 3) {
                make_drop_move(nums[0], nums[1], nums[2]);
            }
            if (nums.length === 4) {
                make_move(nums[0], nums[1], nums[2], nums[3]);
            }
            else if (nums.length === 5) {
                make_move(nums[0], nums[1], nums[2], nums[3], nums[4]);
            }
        }
    }
}