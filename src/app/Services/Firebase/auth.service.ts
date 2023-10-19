import { Injectable, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  firebaseConfig = {
    apiKey: "AIzaSyBBbEUHGhTCavfixQmyBqMOEhJ-s9xfbsU",
    authDomain: "crooked-rook.firebaseapp.com",
    databaseURL: "https://crooked-rook-default-rtdb.firebaseio.com",
    projectId: "crooked-rook",
    storageBucket: "crooked-rook.appspot.com",
    messagingSenderId: "612890880400",
    appId: "1:612890880400:web:bf191526f0789a2ade2b15"
  };
  constructor() {
    firebase.initializeApp(this.firebaseConfig);
  }

  loggedIn: boolean = false;
  name?: string;
  userId?: string;
  userRef?: firebase.database.Reference;
  provider?: string;

  logOut() {
    firebase.auth().signOut();
  }
  setName(name: string) {
    this.name = name;
  }

  signInGoogle() {
    let google = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(google)
    .catch((error) => {
        console.error(error.message);
    });
  }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
          this.userId = user.uid;
          this.userRef = firebase.database().ref(`users/${this.userId}`);
          this.loggedIn = true;
          this.provider = "anonymous";
          let default_name = "New User";
          let email = "none";
  
          let providerData = firebase.auth().currentUser?.providerData;
          if (providerData && providerData[0]) {
              // console.log(providerData[0]);
              if (providerData[0].providerId === "google.com") {
                  this.provider = "google";
                  if (providerData[0].displayName != null)
                    default_name = providerData[0].displayName;
                  if (providerData[0].email != null)
                    email = providerData[0].email;
              }
          }
  
          this.userRef.on("value", (snapshot) => {
              let this_user = snapshot.val();
              if (this_user) {
                this.name = this_user.name;
              }
              else {
                  console.log("Creating new user");
                  this.userRef?.set({
                      id: this.userId,
                      name: default_name,
                      provider: this.provider,
                      email,
                      isOnline: true,
                      lastLogout: new Date(),
                      friends: [],
                      starredBoards: [],
                      trophies: [],
                      stats: {
                        boardsCreated: 0,
                        boardsPlayed: [],
                        gamesPlayed: 0,
                        gamesDrew: 0,
                        gamesLost: 0,
                        gamesWon: 0,
                      }
                  });
                  this.name = default_name;
              }
          });
      }
      else {
          this.loggedIn = false;
      }
  });
  }

}
