import { Injectable, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthCredential, User, signOut } from "firebase/auth";
import { Firestore, getFirestore, doc, getDoc, setDoc, collection, DocumentData } from "firebase/firestore";
import { ErrorService } from '../error.service';


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
  app?: firebase.app.App;
  db?: Firestore;
  constructor(private error: ErrorService) {
    this.app = firebase.initializeApp(this.firebaseConfig);
    this.db = getFirestore(this.app);
  }

  loggedIn: boolean = false;
  name?: string;
  userId?: string;
  userRef?: firebase.database.Reference;
  provider?: string;

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
    
    this.name = name;
  }

  signInGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // console.log(credential, token, user);
        this.signInUser(credential, token, user);
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.error(errorMessage);
      });
  }

  async signInUser(credential: OAuthCredential | null, token: string | undefined, user: User) {
    if (!this.db) {
      this.error.addError("Trying to sign in, but database is not initialized")
      return;
    }

    const docRef = doc(this.db, "Users", user.uid);
    const docSnap = await getDoc(docRef);
    this.loggedIn = true;
    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      let data: DocumentData = docSnap.data();
      this.name = data['name'] ?? '';
    } else {
      // docSnap.data() will be undefined in this case
      // console.log("Creating user");
      this.createNewUser(user.uid, user.displayName ?? '', user.email ?? '', credential?.providerId ?? '');
      this.name = user.displayName ?? '';
    }
  }

  async createNewUser(id: string, name: string, email: string, provider: string) {
    if (!this.db) {
      this.error.addError("Trying to create new user, but the database isn't initialized")
      return;
    }
    await setDoc(doc(collection(this.db, "Users"), id), {
      id,
      name,
      provider,
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
  }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged((user) => {
      console.log("Auth change triggered")
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
