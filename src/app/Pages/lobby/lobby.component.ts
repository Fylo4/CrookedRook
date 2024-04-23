import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { collection, onSnapshot } from 'firebase/firestore';
import { Unsubscribe } from 'firebase/auth';

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
export class LobbyComponent implements OnDestroy {
  constructor(public dialog: MatDialog, public auth: AuthService, public db: DBService) {
    this.tryTrackLobbies();
    this.auth.onSignin.pipe(takeUntilDestroyed()).subscribe(() => {
      this.tryTrackLobbies();
    });
  }
  lobbies: StoredLobbyType[] = [];
  private trackingLobbies?: undefined | Unsubscribe;

  tryTrackLobbies() {
    if (this.trackingLobbies == undefined && this.auth.loggedIn && this.auth.db) {
      this.trackingLobbies = onSnapshot(collection(this.auth.db, "Lobbies"), (docs) => {
        this.lobbies = docs.docs.map(doc => ({ ...doc.data(), id: doc.id }) as StoredLobbyType);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.trackingLobbies != undefined) {
      this.trackingLobbies(); // Unsubscribes from the listener
    }
  }


  openCreateDialog() {
    this.dialog.open(CreateRoomComponent);
  }
  loadPublicLobbies() {
    // this.db.getPublicLobbies().subscribe({
    //   next: v => {
    //     this.lobbies = v as StoredLobbyType[];
    //   },
    //   error: e => console.error(e)
    // })
  }
}