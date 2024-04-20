import { Injectable, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthCredential, User, signOut } from "firebase/auth";
import { Firestore, getFirestore, doc, getDoc, setDoc, collection, DocumentData } from "firebase/firestore";
import { ErrorService } from '../error.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseConfig = {
    apiKey: "AIzaSyBBbEUHGhTCavfixQmyBqMOEhJ-s9xfbsU",
    authDomain: "crooked-rook.firebaseapp.com",
    databaseURL: "https://crooked-rook-default-rtdb.firebaseio.com",
    projectId: "crooked-rook",
    storageBucket: "crooked-rook.appspot.com",
    messagingSenderId: "612890880400",
    appId: "1:612890880400:web:bf191526f0789a2ade2b15"
  };
  app?: firebase.app.App;
  db?: Firestore;
  constructor(private error: ErrorService, private http: HttpClient) {
    this.app = firebase.initializeApp(this.firebaseConfig);
    this.db = getFirestore(this.app);
  }

  loggedIn: boolean = false;
  user?: TCRUser;
  token?: string;
  userRef?: firebase.database.Reference;
  provider?: string;

  getAuthHeader() {
    return {
      headers: {
        "Authorization": "Bearer " + this.token
      }
    }
  }


  logOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.loggedIn = false;
    }).catch((error) => {
      //To do: Catch error
    });
  }
  setName(name: string) {
    if (!this.loggedIn) {
      this.error.addError("Attempting to change name while not signed in");
      return;
    }
    
  }

  signInGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // console.log(credential, token, user);
        await this.getUserToken().then(() => {
          this.getUser().subscribe({
            next: u => {
              console.log("User: ", u);
              this.user = u;
              this.loggedIn = true;
            },
            error: e => {
              console.error(e.message);
            }
          })
        }).catch(error => {
          console.error(error.message);
        });
      }).catch((error) => {
        const errorMessage = error.message;
        console.error(errorMessage);
      });
  }
  async getUserToken() {
    let u = getAuth().currentUser;
    if (!u) return;
    return u.getIdToken(true).then(idToken => {
      this.token = idToken;
    }).catch(function(error) {
      console.error("Error getting the current token: ", error);
    });
  }

  
  getUser() {
    return this.http.get<any>('https://us-central1-crooked-rook.cloudfunctions.net/auth/user', 
    this.getAuthHeader());
  }

}

export interface TCRUser {
  friends: string[],
  id: string,
  name: string,
  isOnline: boolean,
  lastLogout: Date,
  myBoards: string[],
  starredBoards: string[],
  stats: {
    boardsPlayed: string[],
    gamesDrew: number,
    gamesWon: number,
    gamesLost: number,
    gamesPlayed: number
  },
  trophies: number[]
}