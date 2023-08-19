import { Injectable } from '@angular/core';
import { GameContainer } from "../../assets/TCR_Core/tcr";
import { chess } from 'src/assets/boards/Chess/chess';
import { shogi } from 'src/assets/boards/Shogi/shogi';
import { MatDialog } from '@angular/material/dialog';
import { ErrorService } from './error.service';
import { PieceInfoPanelComponent } from '../Dialogs/piece-info-panel/piece-info-panel.component';
import { BoardLoadingService } from './board-loading.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  game: GameContainer = new GameContainer(chess, undefined, "canon");

  fitToScreen() {
    //canvas border = 2px * 2
    //page padding-left and right = 32px * 2
    let width = document.body.clientWidth - 64 - 4;
    //padding shrinks to 4px * 2 at certain width
    if (window.innerWidth <= 500) {
      width = document.body.clientWidth - 8 - 4;
    }
    //Give 50px of vertical padding space
    let height = document.body.clientHeight - 50 - 4;
    this.error.handle(this.game.clampCanvasSize, width, height);
    this.error.handle(this.game.renderEntireBoard);
  }

  constructor(public dialog: MatDialog, private error: ErrorService, private loader: BoardLoadingService) {
    this.game.handleInspect = (pieceId: number) => {
      this.dialog.open(PieceInfoPanelComponent, { data: {pieceId: pieceId}});
    }
    this.game.getJsonFromCanon = (name: string) => {
      return this.loader.getFromName(name)?.value;
    }
  }
}
