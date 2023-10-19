import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { JoinTableComponent } from './joinTable/joinTable.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateRoomComponent } from 'src/app/Dialogs/create-room/create-room.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SpectateTableComponent } from './spectateTable/spectateTable.component';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    JoinTableComponent,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    SpectateTableComponent,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class LobbyComponent {
  constructor(public dialog: MatDialog, public auth: AuthService) {}

  openCreateDialog() {
    this.dialog.open(CreateRoomComponent);
  }
}