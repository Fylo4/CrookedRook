import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ErrorService } from 'src/app/Services/error.service';
import { GameService } from 'src/app/Services/game.service';

@Component({
  selector: 'app-tcr-history',
  templateUrl: './tcr-history.component.html',
  styleUrls: ['./tcr-history.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule,
  ],
})
export class TcrHistoryComponent {
  @Input() matchWidth: boolean = false;

  constructor(public g: GameService, public error: ErrorService) {}
  
  getHistWidth(arrLength: number) {
    return 100/Math.max(arrLength, this.g.game.gameData.turn_list.length);
  }
  getHeight() {
    if (this.matchWidth)
      return "max-content";
    let canvas = document.getElementById("board_canvas_0") as HTMLCanvasElement;
    return canvas.height+"px";
  }
  getWidth() {
    if (!this.matchWidth)
      return "300px";
    let canvas = document.getElementById("board_canvas_0") as HTMLCanvasElement;
    return canvas.width+"px";
  }
  canPass() {
    return this.g.game.boardHistory[this.g.game.viewMove].canPass();
  }
  isOpenDraw() {
    return this.g.game.boardHistory[this.g.game.boardHistory.length-1].open_draw;
  }
}
