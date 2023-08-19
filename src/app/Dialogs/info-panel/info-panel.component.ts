import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
  ],
})
export class InfoPanelComponent {
  constructor(
    public dialogRef: MatDialogRef<InfoPanelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, text: string[]},
  ) {}

  closeModal() {
    this.dialogRef.close();
  }
}
