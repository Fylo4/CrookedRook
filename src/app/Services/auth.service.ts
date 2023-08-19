import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  loggedIn = false;
  name = "Fylo";

  logIn() {
    this.loggedIn = true;
  }
  logOut() {
    this.loggedIn = false;
  }
  setName(name: string) {
    this.name = name;
  }
}
