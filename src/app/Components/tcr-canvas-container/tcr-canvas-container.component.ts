import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/Services/error.service';
import { GameService } from 'src/app/Services/game.service';
import { TcrCanvasComponent } from './tcr-canvas/tcr-canvas.component';
import { TcrHistoryComponent } from './tcr-history/tcr-history.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tcr-canvas-container',
  templateUrl: './tcr-canvas-container.component.html',
  styleUrls: ['./tcr-canvas-container.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TcrCanvasComponent,
    TcrHistoryComponent,
  ],
})
export class TcrCanvasContainerComponent implements OnInit {
  constructor(public g: GameService, public error: ErrorService) {}

  spaceBeside() {
    let pagePadding = window.innerWidth <= 500 ? 8 : 64;
    //300 for history div, 4 for border
    let w = 0;
    if (this.g.game.canvases[0])
      w = this.g.game.canvases[0].width + 300 + pagePadding + 4;
    return w <= document.body.clientWidth;
  }
  
  ngOnInit(): void {
    let cc = document.getElementById("board_canvas_container");
    if(cc) this.g.game.canvasContainer = cc;
    this.g.game.blend_canvas = document.getElementById('blend_canvas') as HTMLCanvasElement;
    this.g.game.canvases = [
      document.getElementById('board_canvas_0') as HTMLCanvasElement,
      document.getElementById('board_canvas_1') as HTMLCanvasElement,
      document.getElementById('board_canvas_2') as HTMLCanvasElement,
      document.getElementById('board_canvas_3') as HTMLCanvasElement,
      document.getElementById('board_canvas_4') as HTMLCanvasElement,
      document.getElementById('board_canvas_5') as HTMLCanvasElement,
    ];
    if (this.g.game.canvases[5]) {
      this.g.game.canvases[5].addEventListener('mousemove', (e) => {
        this.error.handle(this.g.game.handleMouseMove, e);
      });
      this.g.game.canvases[5].addEventListener('mouseleave', (e) => {
        this.error.handle(this.g.game.handleMouseLeave);
      });
      this.g.game.canvases[5].addEventListener('mousedown', (e) => {
        if (e.button === 2) {
          this.error.handle(this.g.game.handleRmbDown);
        }
      });
      this.g.game.canvases[5].addEventListener('mouseup', (e) => {
        if (e.button === 0) {
          this.error.handle(this.g.game.handleLmbClick);
        } else if (e.button === 2) {
          this.error.handle(this.g.game.handleRmbUp);
        }
      });
    }
    else {
      this.error.addError("Game canvases not found")
    }

    this.g.game.pathToPieceSprites = "assets/pieces";
    this.error.handle(this.g.game.setPieceImages);
    //this.g.game.setCanvasHeight(600, true);
    //this.g.game.renderEntireBoard();
    this.g.fitToScreen();
  }
}
