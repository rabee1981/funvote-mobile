
import { Injectable } from "@angular/core";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
    constructor(private afAuth : AngularFireAuth){}
    login(){
        this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(
            res => {
                console.log(res);
            }
        )
        .catch(
            err => {
                console.log(err);
            }
        )
    }
    logout(){
        this.afAuth.auth.signOut();
    }
    getUserState(){
        return this.afAuth.authState;
    }
}