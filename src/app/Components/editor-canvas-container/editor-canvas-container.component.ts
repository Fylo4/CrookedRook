import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/Services/error.service';
import { GameService } from 'src/app/Services/game.service';
import { TcrCanvasComponent } from './tcr-canvas/tcr-canvas.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ClickData } from 'src/assets/TCR_Core/game_container/GameContainer';

@Component({
  selector: 'app-editor-canvas-container',
  templateUrl: './editor-canvas-container.component.html',
  styleUrls: ['./editor-canvas-container.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TcrCanvasComponent,
    MatButtonModule,
  ],
})
export class EditorCanvasContainerComponent implements OnInit {
  constructor(public g: GameService, public error: ErrorService) {}

  spaceBeside() {
    let pagePadding = window.innerWidth <= 500 ? 8 : 64;
    //300 for history div, 4 for border
    let w = 0;
    if (this.g.editGame.canvases[0])
      w = this.g.editGame.canvases[0].width + 300 + pagePadding + 4;
    return w <= document.body.clientWidth;
  }
  cd!: ClickData;
  
  ngOnInit(): void {
    let cc = document.getElementById("board_canvas_container");
    if(cc) this.g.editGame.canvasContainer = cc;
    this.g.editGame.blend_canvas = document.getElementById('blend_canvas') as HTMLCanvasElement;
    this.g.editGame.canvases = [
      document.getElementById('board_canvas_0') as HTMLCanvasElement,
      document.getElementById('board_canvas_1') as HTMLCanvasElement,
      document.getElementById('board_canvas_2') as HTMLCanvasElement,
      document.getElementById('board_canvas_3') as HTMLCanvasElement,
      document.getElementById('board_canvas_4') as HTMLCanvasElement,
      document.getElementById('board_canvas_5') as HTMLCanvasElement,
    ];
    if (this.g.editGame.canvases[5]) {
      this.g.editGame.canvases[5].addEventListener('mousemove', (e) => {
        this.error.handle(this.g.editGame.handleMouseMove, e);
      });
      this.g.editGame.canvases[5].addEventListener('mouseleave', (e) => {
        this.error.handle(this.g.editGame.handleMouseLeave);
      });
      this.g.editGame.canvases[5].addEventListener('mousedown', (e) => {
        if (e.button === 2) {
          this.error.handle(this.g.editGame.handleRmbDown);
        }
      });
      this.g.editGame.canvases[5].addEventListener('mouseup', (e) => {
        if (e.button === 0) {
          this.error.handle(this.g.editGame.handleLmbClick);
        } else if (e.button === 2) {
          this.error.handle(this.g.editGame.handleRmbUp);
        }
      });
    }
    else {
      this.error.addError("Game canvases not found")
    }

    this.g.editGame.pathToPieceSprites = "assets/pieces";
    this.error.handle(this.g.editGame.setPieceImages);
    this.g.fitToScreen(true);
    this.cd = this.g.editGame.clickData;
  }
  addRankTop() {
    this.g.editGame.addRankTop();
  }
  addRankBottom() {
    this.g.editGame.addRankBottom();
  }
  addFileLeft() {
    this.g.editGame.addFileLeft();
  }
  addFileRight() {
    this.g.editGame.addFileRight();
  }
  deleteRankTop() {
    this.g.editGame.deleteRankTop();
  }
  deleteRankBottom() {
    this.g.editGame.deleteRankBottom();
  }
  deleteFileLeft() {
    this.g.editGame.deleteFileLeft();
  }
  deleteFileRight() {
    this.g.editGame.deleteFileRight();
  }
  isEnable() {
    return this.g.editGame.clickData.clickMode === 'addSquare' ? 'accent' : 'primary';
  }
  isDisable() {
    return this.g.editGame.clickData.clickMode === 'removeSquare' ? 'accent' : 'primary';
  }
}
