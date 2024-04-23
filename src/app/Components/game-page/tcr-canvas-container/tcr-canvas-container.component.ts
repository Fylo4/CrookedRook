import { Component, Input, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/Services/error.service';
import { GameService } from 'src/app/Services/game.service';
import { TcrCanvasComponent } from '../tcr-canvas/tcr-canvas.component';
import { TcrHistoryComponent } from '../tcr-history/tcr-history.component';
import { CommonModule } from '@angular/common';
import { GameContainer } from 'src/assets/TCR_Core/tcr';

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
  @Input() game!: GameContainer;
  constructor(public error: ErrorService) {}

  spaceBeside() {
    let pagePadding = window.innerWidth <= 500 ? 8 : 64;
    //300 for history div, 4 for border
    let w = 0;
    if (this.game.canvases[0])
      w = this.game.canvases[0].width + 300 + pagePadding + 4;
    return w <= document.body.clientWidth;
  }
  
  ngOnInit(): void {
    let cc = document.getElementById("board_canvas_container");
    if(cc) this.game.canvasContainer = cc;
    this.game.blend_canvas = document.getElementById('blend_canvas') as HTMLCanvasElement;
    this.game.canvases = [
      document.getElementById('board_canvas_0') as HTMLCanvasElement,
      document.getElementById('board_canvas_1') as HTMLCanvasElement,
      document.getElementById('board_canvas_2') as HTMLCanvasElement,
      document.getElementById('board_canvas_3') as HTMLCanvasElement,
      document.getElementById('board_canvas_4') as HTMLCanvasElement,
      document.getElementById('board_canvas_5') as HTMLCanvasElement,
    ];
    if (this.game.canvases[5]) {
      this.game.canvases[5].addEventListener('mousemove', (e) => {
        this.error.handle(this.game.handleMouseMove, e);
      });
      this.game.canvases[5].addEventListener('mouseleave', (e) => {
        this.error.handle(this.game.handleMouseLeave);
      });
      this.game.canvases[5].addEventListener('mousedown', (e) => {
        if (e.button === 2) {
          this.error.handle(this.game.handleRmbDown);
        }
      });
      this.game.canvases[5].addEventListener('mouseup', (e) => {
        if (e.button === 0) {
          this.error.handle(this.game.handleLmbClick);
        } else if (e.button === 2) {
          this.error.handle(this.game.handleRmbUp);
        }
      });
    }
    else {
      this.error.addError("Game canvases not found")
    }

    this.game.pathToPieceSprites = "assets/pieces";
    this.error.handle(this.game.setPieceImages);
    // this.g.fitToScreen();
  }
}
