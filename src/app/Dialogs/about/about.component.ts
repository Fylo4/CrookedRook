import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreditsComponent } from '../credits/credits.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
  ],
})
export class AboutComponent {
  constructor(public dialogRef: MatDialogRef<AboutComponent>, public dialog: MatDialog) {}

  closeModal() {
    this.dialogRef.close();
  }

  openCredits() {
    this.dialog.open(CreditsComponent);
  }
}
