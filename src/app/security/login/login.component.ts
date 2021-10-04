import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebaseui from 'firebaseui';
import firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

   ui!: firebaseui.auth.AuthUI;

  constructor(
      private router: Router,
      private afAuth: AngularFireAuth
      ) { }

  ngOnInit(): void {
        this.afAuth.app.then(app => {
          const uiConfig = {
            signInOptions: [
             firebase.auth.GoogleAuthProvider.PROVIDER_ID
            ],
           callbacks: {
             signInSuccessWithAuthResult: this.onLoginSuccessful.bind(this)
            }
          };
         this.ui = new firebaseui.auth.AuthUI(app.auth());
         this.ui.start("#firebase-auth-container", uiConfig);
         this.ui.disableAutoSignIn();
       })

  }

  onLoginSuccessful(result: any) {
    this.router.navigateByUrl("/home");
    return true;
  }

  ngOnDestroy(): void {
    this.ui.delete();
  }


}


