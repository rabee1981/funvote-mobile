
import { Injectable } from "@angular/core";
import { AngularFireAuth } from 'angularfire2/auth';
import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
    
    constructor(private afAuth : AngularFireAuth, private facebook : Facebook, private platform : Platform){}

    signInWithFacebook(): firebase.Promise<any> {
      let permissions = ['email','user_friends','public_profile'];
    if (this.platform.is('cordova')) {
      return this.facebook.login(permissions).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return this.afAuth.auth.signInWithCredential(facebookCredential);
      });
    } else {
      return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    }

  }
    logout(){
        this.afAuth.auth.signOut();
    }
    getUserState(){
        return this.afAuth.authState;
    }

    getCurrentUser(){
        return this.afAuth.auth.currentUser;
    }


}