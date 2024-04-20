import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { JoinTableComponent } from './joinTable/joinTable.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateRoomComponent } from 'src/app/Dialogs/create-room/create-room.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SpectateTableComponent } from './spectateTable/spectateTable.component';
import { AuthService } from 'src/app/Services/Firebase/auth.service';
import { DBService } from 'src/app/Services/Firebase/db.service';
import { StoredLobbyType } from 'src/types/types';

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
export class LobbyComponent implements OnInit{
  constructor(public dialog: MatDialog, public auth: AuthService, public db: DBService) {}
  lobbies: StoredLobbyType[] = [];
  lobbiesLoaded: boolean = false;

  ngOnInit(): void {
    this.loadPublicLobbies();
  }

  openCreateDialog() {
    this.dialog.open(CreateRoomComponent);
  }
  loadPublicLobbies() {
    this.db.getPublicLobbies().subscribe({
      next: v => {
        console.log(v);
        this.lobbies = v as StoredLobbyType[];
        this.lobbiesLoaded = true;
      },
      error: e => console.error(e)
    })
  }
}