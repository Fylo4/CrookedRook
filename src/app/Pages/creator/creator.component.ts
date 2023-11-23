import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GameService } from 'src/app/Services/game.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorService } from 'src/app/Services/error.service';
import { MatDialog } from '@angular/material/dialog';
import { BoardInfoComponent } from 'src/app/Dialogs/board-info/board-info.component';
import { InfoPanelComponent } from 'src/app/Dialogs/info-panel/info-panel.component';
import { EditorCanvasContainerComponent } from 'src/app/Components/editor-canvas-container/editor-canvas-container.component';

// firebase.initializeApp(environment.firebase);

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    EditorCanvasContainerComponent,
  ],
})
export class CreatorComponent{
  constructor(public g: GameService, private error: ErrorService, public dialog: MatDialog) {} 
  
  openBoardInfoDialog() {
    this.dialog.open(BoardInfoComponent);
  }

  copyHistory() {
    this.dialog.open(InfoPanelComponent, {data: {title: "Move History", text: this.g.editGame.getHistoryAsString()}})
  }

  copyExport() {
    this.dialog.open(InfoPanelComponent, {data: {title: "Export Code", text: [this.g.editGame.getExport()]}})
  }
  screenshot() {
    
  }
}
