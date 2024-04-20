import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ErrorService } from 'src/app/Services/error.service';
import { GameService } from 'src/app/Services/game.service';
import { downloadHjson } from 'src/assets/TCR_Core/hjson';
var Hjson = require('hjson');

@Component({
  selector: 'app-style',
  templateUrl: './style.component.html',
  styleUrls: ['./style.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
})
export class StyleComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<StyleComponent>,
    public g: GameService,
    public error: ErrorService,
  ) {}
  showAdvanced = false;
  reader = new FileReader();

  ngOnInit() {
    //Load style functionality
    this.reader.onload = (e: any) => {
      let data = String.fromCharCode.apply(
          null,
          Array.from(new Uint8Array(e.target.result))
      );
      let fileResult = this.error.handle(Hjson.parse, data);
      if (fileResult)
        this.g.game.styleData = fileResult;
      this.g.game.renderEntireBoard();
    };
  }

  closeModal() {
    this.dialogRef.close();
  }

  zoomIn() {
    this.error.handle(this.g.game.setCanvasHeight, this.g.game.canvases[0].height + 50, true);
    this.error.handle(this.g.game.renderEntireBoard);
  }
  zoomOut() {
    this.error.handle(this.g.game.setCanvasHeight, Math.max(this.g.game.canvases[0].height - 50, 50), true);
    this.error.handle(this.g.game.renderEntireBoard);
  }
  setColor(color: string) {
    this.g.game.line_col = color;
  }
  isSelected(color: string) {
    return this.g.game.line_col.toLowerCase() === color;
  }
  downloadStyle() {
    downloadHjson(this.g.game.styleData, "style.hjson");
  }
  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
    this.reader.readAsArrayBuffer(inputNode.files[0]);
  }
}
