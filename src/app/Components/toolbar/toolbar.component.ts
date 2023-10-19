import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AboutComponent } from 'src/app/Dialogs/about/about.component';
import { RouterModule } from '@angular/router';
import { LoadBoardComponent } from 'src/app/Dialogs/load-board/load-board.component';
import { AuthService } from 'src/app/Services/auth.service';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from 'src/app/Dialogs/profile/profile.component';
import { StyleComponent } from 'src/app/Dialogs/style/style.component';
import { MatDividerModule } from '@angular/material/divider';
import { SignInComponent } from 'src/app/Dialogs/sign-in/sign-in.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    RouterModule,
    CommonModule,
    MatDividerModule,
  ]
})
export class ToolbarComponent {
  constructor(public dialog: MatDialog, public auth: AuthService) {}

  openAboutDialog() {
    this.dialog.open(AboutComponent);
  }
  signInWithGoogle() {
    //this.dialog.open(SignInComponent);
    this.auth.signInGoogle();
  }
  
  openLoadDialog() {
    this.dialog.open(LoadBoardComponent);
  }
  openProfileDialog() {
    this.dialog.open(ProfileComponent);
  }
  openStyleDialog() {
    this.dialog.open(StyleComponent);
  }
}
