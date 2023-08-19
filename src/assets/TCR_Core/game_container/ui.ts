import { GameRules, PieceAttributes } from "../Constants";
import { GameContainer } from "./GameContainer";
import { highlighted_hand_piece } from "./render";
import { validate_drop, validate_move } from "../board/make_move";
import * as DOMPurify from "dompurify";
import { elemHeight, elemWidth } from "../utils";

export function _handleRmbDown(container: GameContainer) {
    container.clickData.down_sq = container.clickData.mouseSqPos.sq;
    container.renderCirclesAndLines();
}

export function _handleRmbUp(container: GameContainer) {
    let cd = container.clickData;
    if (cd.down_sq === cd.mouseSqPos.sq) {
        container.addCircle({sq: cd.mouseSqPos.sq, col: container.line_col});
    }
    else {
        container.addLine({sq1: cd.down_sq, sq2: cd.mouseSqPos.sq, col: container.line_col});
    }
    cd.down_sq = -1;
    container.renderCirclesAndLines();
}

export function _handleMouseLeave(container: GameContainer) {
    let cd = container.clickData;
    cd.mouseSqPos = { x: -1, y: -1, sq: -1 };
    cd.oldMouseSq = -1;
    container.renderCirclesAndLines();
    container.renderMoveSquares();
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export function _handleMouseMove(container: GameContainer, event: MouseEvent) {
    //let rect = event.currentTarget?.getBoundingClientRect();
    let x_offset = container.canvases[0].clientWidth - container.canvases[0].offsetWidth;
    let y_offset = container.canvases[0].clientHeight - container.canvases[0].offsetHeight;
    let cd = container.clickData;
    let gd = container.gameData;
    // cd.mousePxPos.x = event.clientX - rect.left + x_offset/2;
    // cd.mousePxPos.y = event.clientY - rect.top + y_offset/2;
    //Not sure if I should use x, screenX, pageX, clientX, offsetX, or if they're all incorrect :/
    cd.mousePxPos.x = event.offsetX;//event.clientX - event.x + x_offset/2;
    cd.mousePxPos.y = event.offsetY;//event.clientY - event.y + y_offset/2;
    cd.mouseSqPos.x = clamp(Math.floor(cd.mousePxPos.x * gd.width / elemWidth(container.canvases[0])), 0, gd.width-1);
    cd.mouseSqPos.y = clamp(Math.floor(cd.mousePxPos.y * (gd.height+(gd.hasHand()?2:0)) / elemHeight(container.canvases[0])) - (gd.hasHand()?1:0), -1, gd.height);
    if (container.styleData.flip_board) {
        cd.mouseSqPos.x = gd.width - cd.mouseSqPos.x - 1;
        cd.mouseSqPos.y = gd.height - cd.mouseSqPos.y - 1;
    }
    cd.mouseSqPos.sq = cd.mouseSqPos.x + cd.mouseSqPos.y * gd.width;
    if (cd.mouseSqPos.sq != cd.oldMouseSq) {
        //If mouse changes square, re-render the board
        container.renderMoveSquares();
        container.renderCirclesAndLines();
        cd.oldMouseSq = cd.mouseSqPos.sq;
    }
}

function handle_make_move(container: GameContainer, src_x: number, src_y: number, dst_x: number, dst_y: number, promotion?: number) {
    if (container.multiplayerData.isInMultiplayerGame)
        container.handleMultiplayerMove(src_x, src_y, dst_x, dst_y, promotion);
    else 
        container.makeMove(src_x, src_y, dst_x, dst_y, promotion);
}
function handle_drop_move(container: GameContainer, piece: number, color: boolean, square: number, promotion?: number) {
    if (container.multiplayerData.isInMultiplayerGame) 
        container.handleMultiplayerDrop(piece, color, square, promotion);
    else
        container.makeDropMove(piece, color, square, promotion);
}

export function _handleLmbClick(container: GameContainer) {
    let board = container.boardHistory[container.viewMove];
    let gd = container.gameData;
    let cd = container.clickData;

    if (board.victory.val != -1)
        return;
    
    if (cd.waiting_for_promotion)
        clickWhileWaitingForPromotion(container);
    else if (cd.inspect) {
        cd.inspect = false;
        let piece = board.identify_piece(cd.mouseSqPos.sq);
        if (piece >= 0) {
            //let p = gd.all_pieces[piece];
            //container.handleInspect(DOMPurify.sanitize(p.name),  DOMPurify.sanitize(p.description));
            container.handleInspect(piece);
        }
    }
    else if (cd.selected || board.is_piece_locked)
        clickWhilePieceIsSelected(container);
    else if (cd.hand_selected)
        clickWhileHandIsSelected(container);
    else if (cd.mouseSqPos.y === -1 || cd.mouseSqPos.y === gd.height)
        clickOnHand(container);
    else if ((!board.turn && board.white_ss.get(cd.mouseSqPos.sq)) || (board.turn && board.black_ss.get(cd.mouseSqPos.sq)))
        clickOnPiece(container);

    container.clearLinesAndCircles();
    container.renderMoveSquares();
}

function clickWhileWaitingForPromotion(container: GameContainer) {
    let board = container.boardHistory[container.viewMove];
    let gd = container.gameData;
    let cd = container.clickData;

    let width_px = elemWidth(container.canvases[0]) / gd.width; //Width and height should be the same
    let height_px = elemHeight(container.canvases[0]) / (gd.height + (gd.hasHand() ? 2 : 0));
    let start_width = elemWidth(container.canvases[0]) / 2 - height_px * cd.promotions.length / 2;
    let start_height = elemHeight(container.canvases[0]) / 2 - height_px / 2;
    let clicked_piece = Math.floor((cd.mousePxPos.x - start_width) / width_px);
    if (cd.mousePxPos.y >= start_height && cd.mousePxPos.y <= start_height + height_px
        && clicked_piece >= 0 && clicked_piece < cd.promotions.length) {
        let prom = cd.promotions[clicked_piece];
        let src = board.is_piece_locked ? board.piece_locked_pos : cd.selected_position;
        let dst = cd.move_to;
        let src_x = src % gd.width, src_y = Math.floor(src / gd.width);
        let dst_x = dst % gd.width, dst_y = Math.floor(dst / gd.width);
        if(validate_move(board, src_x, src_y, dst_x, dst_y, prom)) {
            handle_make_move(container, src_x, src_y, dst_x, dst_y, prom);
            container.renderAfterMove();
        }
        else {
            throw new Error("Invalid move attempted after promotion was selected.");
        }
        cd.selected = false;
    }
    cd.waiting_for_promotion = false;
    container.renderPromotionMenu();
}
function clickWhilePieceIsSelected(container: GameContainer) {
    let board = container.boardHistory[container.viewMove];
    let gd = container.gameData;
    let cd = container.clickData;
    let src = board.is_piece_locked ? board.piece_locked_pos : cd.selected_position;
    if (!board.can_move_ss[src].get(cd.mouseSqPos.sq)) {
        cd.selected = false;
        return;
    }
    //See how many promotions are possible
    let dst = cd.mouseSqPos.sq;
    let promote_to = board.find_promotions(
        board.identify_piece(src),
        src,
        dst,
        board.white_ss.get(src),
        board.black_ss.get(src)
    );
    let src_x = src % gd.width,
        src_y = Math.floor(src / gd.width);
    let dst_x = cd.mouseSqPos.x,
        dst_y = cd.mouseSqPos.y;
    if (promote_to.length < 2) {
        if (validate_move(board, src_x, src_y, dst_x, dst_y)) {
            handle_make_move(container, src_x, src_y, dst_x, dst_y);
            container.renderAfterMove();
        } else {
            throw new Error('Invalid move attempted.');
        }
        cd.selected = false;
    } else if (
        board
            .get_attributes(board.identify_piece(src))
            .includes(PieceAttributes.random_promotion)
    ) {
        let prom = promote_to[Math.floor(Math.random() * promote_to.length)];
        if (validate_move(board, src_x, src_y, dst_x, dst_y, prom)) {
            handle_make_move(container, src_x, src_y, dst_x, dst_y, prom);
            container.renderAfterMove();
        } else {
            throw new Error('Invalid move attempted (random promotion).');
        }
        cd.selected = false;
    } else {
        cd.waiting_for_promotion = true;
        cd.promotions = promote_to;
        cd.move_to = cd.mouseSqPos.sq;
        container.renderPromotionMenu();
    }
}
function clickWhileHandIsSelected(container: GameContainer) {
    let board = container.boardHistory[container.viewMove];
    let gd = container.gameData;
    let cd = container.clickData;
    
    if (cd.mouseSqPos.sq >= 0 && cd.mouseSqPos.sq < gd.width * gd.height) {
        let drop_zone = cd.selected_side ?
            board.can_drop_piece_to.black[cd.selected_position]:
            board.can_drop_piece_to.white[cd.selected_position];
        if (drop_zone.get(cd.mouseSqPos.sq) && !board.white_ss.get(cd.mouseSqPos.sq) && !board.black_ss.get(cd.mouseSqPos.sq)) {
            //Piece, color, dest
            if(validate_drop(board, cd.selected_position, cd.selected_side, cd.mouseSqPos.sq)) {
                handle_drop_move(container, cd.selected_position, cd.selected_side, cd.mouseSqPos.sq);
                container.renderAfterMove();
            }
            else {
                throw new Error("Invalid drop attempted.");
            }
        }
    }
    cd.hand_selected = false;
}
function clickOnHand(container: GameContainer) {
    let board = container.boardHistory[container.viewMove];
    let cd = container.clickData;
    
        //We clicked a hand
        let hover = highlighted_hand_piece(container);
        if (hover.piece >= 0 && hover.color === board.turn && board.slots_left(hover.piece, hover.color)
            && ((!board.turn && container.localControl.white) || (board.turn && container.localControl.black))) {
            cd.hand_selected = true;
            cd.selected_side = hover.color;
            cd.selected_position = hover.piece;
        }
}
function clickOnPiece(container: GameContainer) {
    let board = container.boardHistory[container.viewMove];
    let cd = container.clickData;
    
    if (!board.can_move_ss[cd.mouseSqPos.sq].is_zero() && board.can_move(board.turn)
    && ((!board.turn && container.localControl.white) || (board.turn && container.localControl.black))) {
        cd.selected = true;
        cd.selected_position = cd.mouseSqPos.sq;
    }
}

export function _previousMove(container: GameContainer) {
    if (container.viewMove > 0) {
        container.viewMove --;
        container.renderAfterMove();
    }
}

export function _nextMove(container: GameContainer) {
    if (container.viewMove < container.boardHistory.length - 1) {
        container.viewMove ++;
        container.renderAfterMove();
    }
}

export function _firstMove(container: GameContainer) {
    container.viewMove = 0;
    container.renderAfterMove();
}

export function _lastMove(container: GameContainer) {
    container.viewMove = container.boardHistory.length - 1;
    container.renderAfterMove();
}