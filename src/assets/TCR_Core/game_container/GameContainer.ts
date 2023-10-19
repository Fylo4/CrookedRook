import { Observable, of } from "rxjs";
import { Board } from "../board/Board";
import { GameData } from "../game_data/GameData";
import { StyleData } from "./StyleData";
import { _addCircle, _addLine, _adjustCanvasHeight, _adjustCanvasWidth, _clampCanvasSize, _clearLinesAndCircles, _exportHistory, _getExport, _getHistoryAsString, _importHistory, _importHistoryOld, _makeDropMove, _makeMove, _moveHistoryAsTurnArray, _pass, _setCanvasHeight, _setCanvasWidth, _setPieceImages, _startFromJson } from "./containter_funcs";
import { _print_history, _render_after_move, _render_all_spaces, _render_circles_and_lines, _render_entire_board, _render_glows, _render_move_squares, _render_pieces, _render_promotion_menu } from "./render";
import { _firstMove, _handleLmbClick, _handleMouseLeave, _handleMouseMove, _handleRmbDown, _handleRmbUp, _lastMove, _nextMove, _previousMove } from "./ui";
import { HistoryRecord } from "../board/make_move";

export type LoadedFrom = "canon" | "file" | "server" | "editor" | "unknown";

export class GameContainer {
    gameData!: GameData;
    boardHistory: Board[] = [];
    moveHistory: HistoryRecord[] = []; //Notations
    loadedFrom: LoadedFrom = "canon";
    lastLoadedBoard: any; //For downloading loaded boards
    clickData = new ClickData;
    multiplayerData = new MultiplayerData;
    line_col: string = 'green';
    circles: Circle[] = [];
    lines: Line[] = [];
    styleData = new StyleData;
    viewMove: number = 0;
    //Which sides do the local client control, as opposed to an online player or AI
    localControl: {white: boolean, black: boolean} = {white: true, black: true};

    constructor(data: any, seed: number = 0, from: LoadedFrom = "unknown") {
        this.startFromJson(data, seed, from);
        //console.log(this.gameData);
        
        loadImage(this, "movable", (img: ImageBitmap) => this.img_movable = img);
        loadImage(this, "glow", (img: ImageBitmap) => this.img_glow = img);
        loadImage(this, "glow_check", (img: ImageBitmap) => this.img_glow_check = img);
        loadImage(this, "sq_canmove", (img: ImageBitmap) => this.img_sq_canmove = img);
        loadImage(this, "sq_canmove_sel", (img: ImageBitmap) => this.img_sq_canmove_sel = img);
        loadImage(this, "sq_canmove_turn", (img: ImageBitmap) => this.img_sq_canmove_turn = img);
        loadImage(this, "selected_hovered", (img: ImageBitmap) => this.img_selected_hovered = img);
    }
    
    //HTML Elements
    canvasContainer?: HTMLElement;
    canvases: HTMLCanvasElement[] = [];
    blend_canvas?: HTMLCanvasElement;
    //Images
    img_movable?: ImageBitmap;
    img_selected_hovered?: ImageBitmap;
    img_glow?: ImageBitmap;
    img_glow_check?: ImageBitmap;
    img_sq_canmove?: ImageBitmap;
    img_sq_canmove_sel?: ImageBitmap;
    img_sq_canmove_turn?: ImageBitmap;
    img_pieces = new Map<string, ImageBitmap>();
    pathToPieceSprites = "";

    addLine = (line: Line): void => _addLine(this, line);
    addCircle = (circle: Circle): void => _addCircle(this, circle);
    clearLinesAndCircles = (): void => _clearLinesAndCircles(this);
    setCanvasHeight = (height: number, andAdjust: boolean = false): void => _setCanvasHeight(this, height, andAdjust);
    setCanvasWidth = (width: number): void => _setCanvasWidth(this, width);
    adjustCanvasHeight = (): void => _adjustCanvasHeight(this);
    adjustCanvasWidth = (): void => _adjustCanvasWidth(this);
    clampCanvasSize = (width: number, height: number): void => _clampCanvasSize(this, width, height);
    startFromJson = (data: any, seed?: number, from?: LoadedFrom): void => _startFromJson(this, data, seed, from);
    setPieceImages = (): void => _setPieceImages(this);
    makeMove = (src_x: number, src_y: number, dst_x: number, dst_y: number, promotion?: number): void => _makeMove(this, src_x, src_y, dst_x, dst_y, promotion);
    makeDropMove = (piece: number, color: boolean, square: number, promotion?: number): void => _makeDropMove(this, piece, color, square, promotion);
    moveHistoryAsTurnArray = (): HistoryRecord[][] => _moveHistoryAsTurnArray(this);
    pass = (): boolean => _pass(this);
    getHistoryAsString = (): string[] => _getHistoryAsString(this);
    getExport = (): string => _getExport(this);
    getExportOld = (): string => _exportHistory(this);
    importHistory = (history: string): void => _importHistory(this, history);
    importHistoryOld = (history: string): void => _importHistoryOld(this, history);

    //Render
    renderMoveSquares = (): void => _render_move_squares(this);
    renderEntireBoard = (): void => _render_entire_board(this);
    renderAfterMove = (): void => _render_after_move(this);
    renderPieces = (): void => _render_pieces(this);
    renderCirclesAndLines = (): void => _render_circles_and_lines(this);
    renderPromotionMenu = (): void => _render_promotion_menu(this);
    renderGlows = (): void => _render_glows(this);
    renderAllSpaces = (): void => _render_all_spaces(this);
    printHistory = (): void => _print_history(this);

    //UI
    handleRmbDown = (): void => _handleRmbDown(this);
    handleRmbUp = (): void => _handleRmbUp(this);
    handleLmbClick = (): void => _handleLmbClick(this);
    handleMouseLeave = (): void => _handleMouseLeave(this);
    handleMouseMove = (event: MouseEvent): void => _handleMouseMove(this, event);
    toggleInspect = (): void => {this.clickData.inspect = !this.clickData.inspect};
    previousMove = (): void => _previousMove(this);
    nextMove = (): void => _nextMove(this);
    firstMove = (): void => _firstMove(this);
    lastMove = (): void => _lastMove(this);

    //Hooks
    handleInspect = (pieceId: number): void => { console.log("default") };
    handleMultiplayerMove = (src_x: number, src_y: number, dst_x: number, dst_y: number, promotion?: number): void => {};
    handleMultiplayerDrop = (piece: number, color: boolean, square: number, promotion?: number): void => {};
    onSizeAdjust = (width: number, height: number) => {};
    getJsonFromCanon = (name: string) => {};
    getJsonFromServer = (name: string) => {};
}

export class ClickData {
    selected: boolean = false;
    selected_position: number = -1;
    mouse_pressed: boolean = false; //Not needed?
    waiting_for_promotion: boolean = false;
    promotions: number[] = []; //What can the piece waiting for promotion promote to
    move_to: number = -1; //Where is the piece waiting for promotion moving to
    hand_selected: boolean = false; //Are we about to drop something
    selected_side: boolean = false;
    down_sq: number = -1; //Square index of where you pressed down, -1 default
    mousePxPos: { x: number, y: number } = { x: -1, y: -1 };
    mouseSqPos: { x: number, y: number, sq: number} = { x: -1, y: -1, sq: -1};
    oldMouseSq: number = -1;
    inspect: boolean = false; //Will we inspect the next square we click?
}

export class MultiplayerData {
    isInMultiplayerGame: boolean = false;
    myName: string = "";
    otherName: string = "";
    myCol: boolean = false;
}

export interface Circle {
    sq: number,
    col: string,
}
export interface Line {
    sq1: number,
    sq2: number,
    col: string,
}

function loadImage(container: GameContainer, resourceName: string, resultLambda: any) {
    fetch(new Request(`assets/TCR_Core/images/${resourceName}.png`))
        .then(response => response.blob())
        .then(value => createImageBitmap(value))
        .then(v => {resultLambda(v); container.renderEntireBoard();});
}