import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
  ],
})
export class CreditsComponent {
  
  constructor(public dialogRef: MatDialogRef<CreditsComponent>) {}

  closeModal() {
    this.dialogRef.close();
  }
}
