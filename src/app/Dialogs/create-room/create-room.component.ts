import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { collapseTransition } from 'src/app/Transitions/collapse-y';
import { trigger } from '@angular/animations';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
  ]
})
export class CreateRoomComponent {
  constructor(public dialogRef: MatDialogRef<CreateRoomComponent>) {}

  closeModal() {
    this.dialogRef.close();
  }

  data = {
    boardCode: "",
    playAs: "random",
    isPrivate: false,
    privateCode: "",
    saveMode: "save"
  }

  send() {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }

}

export interface createRoomData {
  boardCode: string;
  playAs: "random" | "white" | "black";
  isPrivate: boolean;
  privateCode?: string;
  isSaved: "save" | "save-anon" | "no-save";
}
