import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GameService } from 'src/app/Services/game.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorService } from 'src/app/Services/error.service';
import { TcrCanvasContainerComponent } from './tcr-canvas-container/tcr-canvas-container.component';
import { GameRules, PieceAttributes } from 'src/assets/TCR_Core/Constants';
import { MatDialog } from '@angular/material/dialog';
import { BoardInfoComponent } from 'src/app/Dialogs/board-info/board-info.component';
import { InfoPanelComponent } from 'src/app/Dialogs/info-panel/info-panel.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    TcrCanvasContainerComponent,
  ],
})
export class MainComponent{
  constructor(public g: GameService, private error: ErrorService, public dialog: MatDialog) {} 
  
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.key === "ArrowRight") {
      this.error.handle(this.g.game.nextMove);
    }
    if (event.key === "ArrowLeft") {
      this.error.handle(this.g.game.previousMove);
    }
  }
  openBoardInfoDialog() {
    this.dialog.open(BoardInfoComponent);
  }

  copyHistory() {
    this.dialog.open(InfoPanelComponent, {data: {title: "Move History", text: this.g.game.getHistoryAsString()}})
  }

  copyExport() {
    this.dialog.open(InfoPanelComponent, {data: {title: "Export Code", text: [this.g.game.getExport()]}})
  }
}
