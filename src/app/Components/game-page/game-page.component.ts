import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorService } from 'src/app/Services/error.service';
import { TcrCanvasContainerComponent } from './tcr-canvas-container/tcr-canvas-container.component';
import { MatDialog } from '@angular/material/dialog';
import { BoardInfoComponent } from 'src/app/Dialogs/board-info/board-info.component';
import { InfoPanelComponent } from 'src/app/Dialogs/info-panel/info-panel.component';
import { stringify_consts } from 'src/assets/TCR_Core/utils';
import { DBService } from 'src/app/Services/Firebase/db.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/Services/Firebase/auth.service';
import { downloadHjson } from 'src/assets/TCR_Core/hjson';
import { GameContainer } from 'src/assets/TCR_Core/tcr';

// Not a single page- Used in several different pages that display game boards

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    TcrCanvasContainerComponent,
    FormsModule,
  ],
})
export class GamePageComponent{
  @Input() game!: GameContainer;

  constructor(
    private error: ErrorService,
    public dialog: MatDialog,
    public db: DBService,
    public auth: AuthService,
  ) {} 
  uploadCode: string = '';

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.key === "ArrowRight") {
      this.error.handle(this.game.nextMove);
    }
    if (event.key === "ArrowLeft") {
      this.error.handle(this.game.previousMove);
    }
  }
  openBoardInfoDialog() {
    this.dialog.open(BoardInfoComponent);
  }

  copyHistory() {
    this.dialog.open(InfoPanelComponent, {data: {title: "Move History", text: this.game.getHistoryAsString()}})
  }

  copyExport() {
    this.dialog.open(InfoPanelComponent, {data: {title: "Export Code", text: [this.game.getExport()]}})
  }
  screenshot() {
    
  }
  btnDownload() {
    let data = stringify_consts(this.game.lastLoadedBoard);
    downloadHjson(data, this.game.gameData.name+".hjson");
  }

  uploadBoard() {
    this.db.postBoard(this.game.lastLoadedBoard, this.uploadCode).subscribe({
      next: v => {
        this.uploadCode = '';
      },
      error: e => {
        if (e.error.includes("Board code already taken"))
          this.error.addError(e.error);
        else
          console.error(e);
      }
    });
  }
}
