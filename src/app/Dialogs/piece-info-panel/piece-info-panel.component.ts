import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PieceInfoComponent } from 'src/app/Components/piece-info/piece-info.component';

@Component({
  selector: 'app-piece-info-panel',
  templateUrl: './piece-info-panel.component.html',
  styleUrls: ['./piece-info-panel.component.scss'],
  standalone: true,
  imports: [
    PieceInfoComponent,
    MatButtonModule,
  ],
})
export class PieceInfoPanelComponent {
  constructor(
    public dialogRef: MatDialogRef<PieceInfoPanelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {pieceId: number},
  ) {}

  closeModal() {
    this.dialogRef.close();
  }
}
