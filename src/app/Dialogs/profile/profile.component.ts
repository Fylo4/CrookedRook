import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from 'src/app/Services/Firebase/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
  ],
})
export class ProfileComponent {
  constructor(public dialogRef: MatDialogRef<ProfileComponent>, public auth: AuthService) {}

  isEditingName = false;
  editNameText = "";

  closeModal() {
    this.dialogRef.close();
  }
  startNameChange() {
    this.editNameText = this.auth.user?.name ?? "";
    this.isEditingName = true;
  }
  cancelNameChange() {
    this.isEditingName = false;
  }
  saveNameChange() {
    this.auth.setName(this.editNameText);
    this.isEditingName = false;
  }
}
