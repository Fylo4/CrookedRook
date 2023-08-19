import { Observable, of } from "rxjs";
import { Board } from "../board/Board";
import { HistoryRecord } from "../board/make_move";
import { GameRules } from "../Constants";
import { GameData } from "../game_data/GameData";
import { cyrb128, mulberry32, time_as_string } from "../random";
import { Circle, ClickData, GameContainer, Line, LoadedFrom, MultiplayerData } from "./GameContainer";
import { elemHeight, elemWidth } from "../utils";

export function _startFromJson(gameContainer: GameContainer, json_data: any, seed: number = 0, from?: LoadedFrom) {
    if(seed === 0)
        seed = cyrb128(time_as_string())[0];
    let rand = mulberry32(seed);

    gameContainer.loadedFrom = from ?? "unknown";
    gameContainer.lastLoadedBoard = JSON.parse(JSON.stringify(json_data));

    gameContainer.gameData = new GameData(json_data);
    gameContainer.gameData.seed = seed;

    let initialBoard = new Board({gameData: gameContainer.gameData, rand});
    
    gameContainer.clickData = new ClickData;
    gameContainer.multiplayerData = new MultiplayerData;

    //Load all piece sprites
    // let piece_sprites = gameContainer.gameData.all_pieces.map(e => e.sprite);
    // piece_sprites.push(...gameContainer.gameData.all_pieces.filter(e => typeof(e.mini_sprite) === 'string').map(e => e.mini_sprite ?? ""));
    // gameContainer.setPieceImages();
    //Style data
    if (gameContainer.gameData.game_rules.includes(GameRules.flip_colors)) { gameContainer.styleData.flip_colors = true; }
    gameContainer.circles = [];
    gameContainer.lines = [];
    if (gameContainer.gameData.style) {
        gameContainer.styleData.style = gameContainer.gameData.style;
    }

    gameContainer.adjustCanvasHeight();
    initialBoard.refresh_moves();
    initialBoard.find_victory();
    gameContainer.moveHistory = [];
    gameContainer.boardHistory = [new Board(initialBoard)];
    gameContainer.viewMove = 0;
    gameContainer.setPieceImages();
    gameContainer.renderEntireBoard();
}
export function _exportHistory(gameContainer: GameContainer) {
    let gd = gameContainer.gameData;
    let mh = gameContainer.moveHistory;

    let code = gd.code ?? gd.name.toLowerCase();
    let ret = code + "," + gd.seed;
    for (let a = 0; a < gameContainer.moveHistory.length; a++) {
        let mha = mh[a]; //So the dumb compiler knows what type it is
        if (mha.type === "drop") {
            ret += `[${mha.piece},${Number(mha.color)},${mha.dest}]`;
        }
        else if (mha.type === "move") {
            let prom = mha.promotion === undefined ? "" : "," + mha.promotion;
            ret += `[${mha.x1},${mha.y1},${mha.x2},${mha.y2}${prom}]`;
        }
        else if (mha.type === "pass") {
            ret += `[pass]`;
        }
    }
    return ret;
} 
export function _importHistoryOld(container: GameContainer, history: string) {
    for (let a = 0; a < history.length; a++) {
        if (history[a] === "[") {
            //Find the closing bracket
            let end = a;
            while (history[end] != "]") {
                end++;
            }
            //Read the four numbers
            let nums = history.substring(a + 1, end).split(",").map(n => Number(n));
            for (let a = 0; a < nums.length; a++) {
                nums[a] = Number(nums[a]);
            }
            if (nums.length === 3) {
                container.boardHistory[container.viewMove].make_drop_move(nums[0], Boolean(nums[1]), nums[2]);
            }
            if (nums.length === 4) {
                container.boardHistory[container.viewMove].make_move(nums[0], nums[1], nums[2], nums[3]);
            }
            else if (nums.length === 5) {
                container.boardHistory[container.viewMove].make_move(nums[0], nums[1], nums[2], nums[3], nums[4]);
            }
        }
    }
}

export function _addCircle(container: GameContainer, circle: Circle) {
    if (circle.sq === undefined || circle.sq < 0) {
        return;
    }
    let index = container.circles.findIndex(e => e.sq === circle.sq);
    if (index != -1) {
        if (container.circles[index].col === container.line_col) {
            container.circles.splice(index, 1);
        }
        else {
            container.circles.splice(index, 1);
            container.circles.push(circle);
        }
    }
    else {
        container.circles.push(circle);
    }
    container.renderCirclesAndLines();
}
//Line is an object like {sq1: number, sq2: number}
export function _addLine(container: GameContainer, line: Line) {
    let max = container.gameData.width * container.gameData.height;
    if(line === undefined || line.sq1 < 0 || line.sq1 >=  max || line.sq2 < 0 || line.sq2 >= max) {
        return;
    }
    let index = container.lines.findIndex(e => (e.sq1 === line.sq1 && e.sq2 === line.sq2));
    if (index > -1) {
        if (container.lines[index].col === container.line_col) {
            container.lines.splice(index, 1);
        }
        else {
            container.lines.splice(index, 1);
            container.lines.push(line);
        }
    }
    else {
        container.lines.push(line);
    }
    container.renderCirclesAndLines();
}
export function _clearLinesAndCircles(container: GameContainer) {
    container.lines = [];
    container.circles = [];
    container.renderCirclesAndLines();
}

export function _setCanvasHeight(gameContainer: GameContainer, height: number, andAdjust: boolean = false) {
    for (let a = 0; a < gameContainer.canvases.length; a ++)
        gameContainer.canvases[a].height = height;
    if (gameContainer.canvasContainer)
        gameContainer.canvasContainer.style.height = height+4+"px";
    if (andAdjust)
        gameContainer.adjustCanvasWidth();
    else
        gameContainer.onSizeAdjust(elemWidth(gameContainer.canvases[0]), height);
}

export function _setCanvasWidth(gameContainer: GameContainer, width: number, andAdjust: boolean = false) {
    for (let a = 0; a < gameContainer.canvases.length; a ++)
        gameContainer.canvases[a].width = width;
    if (gameContainer.canvasContainer)
    gameContainer.canvasContainer.style.width = width+4+"px";
    if (andAdjust)
        gameContainer.adjustCanvasHeight();
    else
        gameContainer.onSizeAdjust(width, elemHeight(gameContainer.canvases[0]));
}

export function _adjustCanvasHeight(gameContainer: GameContainer) {
    let gd = gameContainer.gameData;
    let ratio = (gd.height + (gd.hasHand() ? 2 : 0)) / gd.width;
    if (gameContainer.canvases[0]) {
        let w = elemWidth(gameContainer.canvases[0]);
        //gameContainer.setCanvasWidth(w);
        gameContainer.setCanvasHeight(w * ratio);
    }
}

export function _adjustCanvasWidth(gameContainer: GameContainer) {
    let gd = gameContainer.gameData;
    let ratio = (gd.height + (gd.hasHand() ? 2 : 0)) / gd.width;
    if (gameContainer.canvases[0]) {
        let h = elemHeight(gameContainer.canvases[0]);
        //gameContainer.setCanvasHeight(h);
        gameContainer.setCanvasWidth(h / ratio);
    }
}

export function _clampCanvasSize(container: GameContainer, width: number, height: number) {
    let gd = container.gameData;
    let gd_height = gd.height + (gd.hasHand() ? 2 : 0);
    //If canvas.width = width, what is the height?
    let adjusted_height = width/gd.width * gd_height;
    //If canvas.height = height, what is the width?
    let adjusted_width = height/gd_height * gd.width;
    //One is too high, the other fits (unless it's exactly pixel-perfect)
    if (adjusted_height > height) {
        container.setCanvasHeight(height);
        container.adjustCanvasWidth();
    }
    else {
        container.setCanvasWidth(width);
        container.adjustCanvasHeight();
    }
}


export function _makeMove(container: GameContainer, src_x: number, src_y: number, dst_x: number, dst_y: number, promotion?: number) {
    let newBoardState = new Board(container.boardHistory[container.viewMove]);
    let hr = newBoardState.make_move(src_x, src_y, dst_x, dst_y, promotion);
    post_move(container, hr, newBoardState);
}

export function _makeDropMove(container: GameContainer, piece: number, color: boolean, square: number, promotion?: number) {
    let newBoardState = new Board(container.boardHistory[container.viewMove]);
    let hr = newBoardState.make_drop_move(piece, color, square, promotion);
    post_move(container, hr, newBoardState);
}

function post_move(container: GameContainer, historyRecord: HistoryRecord, newBoard: Board) {
    container.boardHistory.length = container.viewMove + 1;
    container.moveHistory.length = container.viewMove;
    container.boardHistory.push(newBoard);
    container.moveHistory.push({...historyRecord, position: container.moveHistory.length});
    container.viewMove++;
    //Clear out some click data
    container.clickData.hand_selected = false;
    container.clickData.selected = false;
    container.clickData.waiting_for_promotion = false;
}

function getImageObsFromPieceName(container: GameContainer, name: string): Promise<ImageBitmap> {
    return fetch(new Request(`${container.pathToPieceSprites}/${name.toLowerCase()}.png`))
        .then(response => response.blob())
        .then(value => {return createImageBitmap(value)});
}

export function _setPieceImages(container: GameContainer) {
    if (container.pathToPieceSprites === "")
        return;
    //Get all sprites and mini-sprites
    let finishedPieceSprites: {name: string, image: ImageBitmap}[] = []
    Promise.all([...new Set([
            ...container.gameData.all_pieces.map(p => p.sprite),
            ...container.gameData.all_pieces.filter(p => p.mini_sprite).map(p => p.mini_sprite)
        ])].filter(v => v != undefined).map(s => getImageObsFromPieceName(container, s!).then(v => {
            finishedPieceSprites.push({name: s!, image: v});
        }))
    ).then(v => {
        container.img_pieces = new Map(finishedPieceSprites.map(s => [s.name, s.image]));
        container.renderPieces();
    });
}

export function _moveHistoryAsTurnArray(container: GameContainer) {
    let ret: any[][] = [];
    let turnMemory = -1;
    for (let a = 0; a < container.moveHistory.length; a ++) {
        if (container.moveHistory[a].turn != turnMemory) {
            turnMemory ++;
            ret.push([]);
        }
        ret[ret.length-1].push(container.moveHistory[a]);
    }
    return ret;
}

export function _pass(container: GameContainer): boolean {
    let newBoardState = new Board(container.boardHistory[container.viewMove]);
    let hr: HistoryRecord = {type: "pass", notation: "pass", turn: newBoardState.turn_count, position: 0, color: newBoardState.turn};
    let result = newBoardState.pass();
    if (!result) return false;
    post_move(container, hr, newBoardState);
    container.renderAfterMove();
    return true;
}

export function _getHistoryAsString(container: GameContainer): string[] {
    let ret: string[] = [];
    let turn_memory = -1;
    for (let a = 0; a < container.moveHistory.length; a ++) {
        let mh = container.moveHistory[a];
        if (mh.turn != turn_memory) {
            turn_memory = mh.turn;
            ret.push(`${mh.turn+1}. `);
        }
        else {
            ret[ret.length-1] += '\t';
        }
        ret[ret.length-1] += mh.notation;
    }
    return ret;
}

export function _getExport(container: GameContainer): string {
    let ret = '';
    switch(container.loadedFrom) {
        case 'editor':
            throw new Error("You must upload the game before you can save game replays");
        case 'file':
            throw new Error("You must upload the game before you can save game replays");
        case 'unknown':
            throw new Error("It isn't known how this board was loaded- this is probably a bug");
        case 'canon':
            ret += `c|${container.gameData.code}|`;
            break;
        case 'server':
            ret += `s|${container.gameData.code}|`;
            break;
    }
    if (container.gameData.has_random) {
        ret += container.gameData.seed+'|';
    }
    // '||' indicates separation between initial data and move list
    ret += '|';
    for (let a = 0; a < container.moveHistory.length; a ++) {
        let mh = container.moveHistory[a];
        switch(mh.type) {
            case 'drop':
                ret += `d,${mh.piece},${mh.color},${mh.dest}`;
                if (mh.promotion)
                    ret += `,${mh.promotion}`;
                break;
            case 'move':
                let src = mh.x1 + mh.y1*container.gameData.width;
                let dst = mh.x2 + mh.y2*container.gameData.width;
                ret += `${src},${dst}`;
                if (mh.promotion)
                    ret += `,${mh.promotion}`;
                break;
            case 'pass':
                ret += 'pass';
        }
        ret += "|";
    }
    ret += container.boardHistory[container.boardHistory.length-1].victory.val;
    return ret;
}

export function _importHistory(container: GameContainer, history: string) {
    if (!history.includes("||")) {
        container.importHistoryOld(history);
        return;
    }
    let sections = history.split("||");
    let header = sections[0].split("|");
    let seed: number | undefined = Number(header[2]);
    if (Number.isNaN(seed)) seed = undefined;
    if (header[0] === "c") { //Load from canon
        let data = container.getJsonFromCanon(header[1]);
        container.startFromJson(data, seed, "canon");
        container.loadedFrom = "canon";
    }
    else if (header[0] === "s") {
        let data = container.getJsonFromServer(header[1]);
        container.startFromJson(data, seed, "server");
        container.loadedFrom = "server";
    }
    makeImportMoves(container, sections[1]);
}

function makeImportMoves(container: GameContainer, history: string) {
    let moves = history.split("|");
    console.log(`There are ${moves.length} moves`);
    for (let a = 0; a < moves.length; a ++) {
        if (!isNaN(Number(moves[a])))
            continue;
        let move = moves[a].split(",");
        if (move[0] === "pass") {
            container.pass();
        }
        else if(move[0] === "d") { //Drop move
            let promotion = Number.isNaN(move[4]) ? undefined : Number(move[4]);
            container.makeDropMove(Number(move[1]), Boolean(move[2]), Number(move[3]), promotion)
        }
        else { //Normal move
            let promotion = Number.isNaN(move[2]) ? undefined : Number(move[2]);
            let src = Number(move[0]), dst = Number(move[1]);
            let src_x = src % container.gameData.width, src_y = Math.floor(src / container.gameData.width);
            let dst_x = dst % container.gameData.width, dst_y = Math.floor(dst / container.gameData.width);
            container.makeMove(src_x, src_y, dst_x, dst_y, promotion);
        }
    }
}