import { AfterViewInit, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { AuthService } from 'src/app/Services/Firebase/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
  ],
})
export class SignInComponent implements AfterViewInit {
  constructor(public dialogRef: MatDialogRef<SignInComponent>, public auth: AuthService) {}

  closeModal() {
    this.dialogRef.close();
  }

  uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult: any, redirectUrl: any) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        let username = authResult.additionalUserInfo.profile.name;
        let locale = authResult.additionalUserInfo.profile.locale;
        let provider = authResult.additionalUserInfo.providerId;
        let userId = authResult.user.multiFactor.user.uid;
        return false;
      },
    },
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInFlow: 'popup'
  };

  ngAfterViewInit(): void {
    var firebaseui = require('firebaseui');
    let ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', this.uiConfig);
  }
}
