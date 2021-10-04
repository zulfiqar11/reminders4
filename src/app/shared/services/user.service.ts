import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { map } from 'rxjs/operators';

export const ANONYMOUS_USER: User = {
  id: undefined!,
  email: ''
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user$: Observable<any>;
  isLoggedIn$: Observable<boolean> ;
  isLoggedOut$: Observable<boolean>;
  pictureUrl$: Observable<string | null>;
  userName$: Observable<string | null>;
  userEmail$: Observable<string | null>;



  constructor(private afAuth: AngularFireAuth) {
    // afAuth.idToken.subscribe(jwt => console.log("jwt", jwt));
    afAuth.authState.subscribe(auth => console.log("auth", auth));
    this.user$ = afAuth.authState.pipe(map(user1 => user1? user1: null));
    this.isLoggedIn$ = afAuth.authState.pipe(map(user => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));
    this.pictureUrl$ = afAuth.authState.pipe(map(user => user? user.photoURL: null));
    this.userName$ = afAuth.authState.pipe(map(user => user? user.displayName: null));
    this.userEmail$ = afAuth.authState.pipe(map(user => user? user.email: null));

  }

  logout() {
    this.afAuth.signOut();
  }
}
