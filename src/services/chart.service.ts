import { Http, Headers } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController, LoadingController } from 'ionic-angular';
import { FacebookService } from './facebook.service';
import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { AuthService } from "./auth.service";
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import * as firebase from 'firebase';

const enum LocationInDb {
    USER = 1,
    FRIENDS = 2,
    PUBLIC = 3,
}
@Injectable()
export class ChartService {
    useruid;
    alert = this.alertCtrl.create({
        title: 'chart not exist',
        message: 'this chart no longer exist...',
        buttons: ['Ok']

    })
    constructor(private afDatabase: AngularFireDatabase, private authService: AuthService, private fbService: FacebookService,
        private alertCtrl: AlertController, private afAuth: AngularFireAuth, private http: Http, private loadingCtrl: LoadingController) { }
    getUserCharts() {
        return this.afDatabase.list(`users/${this.useruid}/userCharts/`, {
            query: {
                orderByChild: 'createdAt',

            }
        })
    }
    getFavoritesCharts() {
        return this.afDatabase.list(`users/${this.useruid}/follow`)
            .map(favKeyArray => {
                let followCharts = []
                for (let f of favKeyArray) {
                    let locEnum = parseInt(f.$value)
                    if (locEnum == LocationInDb.USER)
                        this.afDatabase.object(`users/${this.useruid}/userCharts/${f.$key}`).subscribe(res => {
                            this.updateFollowArray(followCharts, res)
                        })
                    else if (locEnum == LocationInDb.FRIENDS)
                        this.afDatabase.object(`users/${this.useruid}/friendsCharts/${f.$key}`).subscribe(res => {
                            this.updateFollowArray(followCharts, res)
                        })
                    else if (locEnum == LocationInDb.PUBLIC)
                        this.afDatabase.object(`publicCharts/${f.$key}`).subscribe(res => {
                            this.updateFollowArray(followCharts, res)
                        })
                }
                return followCharts
            })
    }
    updateFollowArray(followCharts, res) {
        let index = followCharts.findIndex(chart => {
            return chart.$key == res.$key
        })
        //favorite chart was removed
        if (res.$value === null && index >= 0) {
            followCharts.splice(index, 1)
        }
        else {
            if (index < 0) {
                followCharts.push(res)
            } else {
                followCharts[index] = res;
            }
        }
    }
    getFriendsCharts() {
        return this.afDatabase.list(`users/${this.useruid}/friendsCharts`, {
            query: {
                orderByChild: 'createdAt'
            }
        })
    }
    voteFor(key, index, owner) { // voters is updated just in the user charts its not updates in the publicCharts and friends charts
        let headers = new Headers();
        this.afAuth.auth.currentUser.getIdToken().then(
            token => {
                headers.append('Authorization', 'Bearer ' + token)
                this.http.get(`https://us-central1-funvaotedata.cloudfunctions.net/voteFor?owner=${owner}&key=${key}&index=${index}`, { headers: headers })
                    .take(1).subscribe(res => {
                        //   console.log(res);
                    })
            })
    }
    getVoteCount(key, owner) {
        return this.afDatabase.object(`users/${owner}/userCharts/${key}/voteCount`)
    }
    getFollowerCount(key, owner) {
        return this.afDatabase.object(`users/${owner}/userCharts/${key}/followerCount`)
    }
    deleteChart(key) {
        let loading = this.loadingCtrl.create({
            content: "deleting chart",
            spinner: 'bubbles'
        })
        loading.present()
        let headers = new Headers();
        this.afAuth.auth.currentUser.getIdToken().then(
            token => {
                headers.append('Authorization', 'Bearer ' + token)
                this.http.get(`https://us-central1-funvaotedata.cloudfunctions.net/deleteChart?key=${key}`, { headers: headers })
                    .take(1).subscribe(res => {
                        loading.dismiss()
                    })
            })
        firebase.storage().ref(`users/${this.useruid}/${key}`).delete()
            .then(() => console.log('chart photo background was deleted'))
            .catch(() => console.log('this chart dont have photo background'))
    }
    followChart(key, owner, isPublic) {
        let location
        if (isPublic === 'true') {
            location = LocationInDb.PUBLIC
        } else if (owner === this.useruid) {
            location = LocationInDb.USER
        } else {
            location = LocationInDb.FRIENDS
        }
        let headers = new Headers();
        this.afAuth.auth.currentUser.getIdToken().then(
            token => {
                headers.append('Authorization', 'Bearer ' + token)
                this.http.get(`https://us-central1-funvaotedata.cloudfunctions.net/followChart?owner=${owner}&key=${key}&locationInDb=${location}`, { headers: headers })
                    .take(1).subscribe(res => {
                        //   console.log(res);
                    })
            })
    }
    isFavor(key) {
        return this.afDatabase.object(`users/${this.useruid}/follow/${key}`);
    }
    isVote(key, owner) { // voters is updated just in the user charts its not updates in the publicCharts and friends charts
        return this.afDatabase.object(`users/${owner}/userCharts/${key}/voters/${this.useruid}`);
    }
    isAllowToCreate() {
        return this.afDatabase.list(`users/${this.useruid}/userCharts`).map(
            userCharts => {
                return userCharts.length < 4;
            }
        )
    }
    saveImage(base64, key) {
        return firebase.storage().ref().child(`users/${this.useruid}/${key}`).putString(base64, 'data_url')
    }
    getImageUrl(owner, key) {
        return this.afDatabase.object(`users/${owner}/userCharts/${key}/backgroundImage`);
    }
    saveImageURLToDatabase(key, url) {
        return this.afDatabase.object(`users/${this.useruid}/userCharts/${key}/backgroundImage`).set(url)
    }
    getListOfFollowers(key, owner) {
        return this.afDatabase.list(`users/${owner}/userCharts/${key}/followers`)
            .map(uidList => {
                let followersInfo = [];
                uidList.forEach(useruid => {
                    this.afDatabase.object(`users/${useruid.$key}/userInfo`).take(1).subscribe(
                        userInfo => {
                            followersInfo.push({ name: userInfo.name, photo: userInfo.pictureUrl });
                        }
                    )
                })
                return followersInfo;
            })
    }
    getListOfVoters(key, owner) {
        return this.afDatabase.list(`users/${owner}/userCharts/${key}/voters`)
            .map(uidList => {
                let votersInfo = [];
                uidList.forEach(useruid => {
                    this.afDatabase.object(`users/${useruid.$key}/userInfo`).take(1).subscribe(
                        userInfo => {
                            votersInfo.push({ name: userInfo.name, photo: userInfo.pictureUrl });
                        }
                    )
                })
                return votersInfo;
            })
    }
    storeDeviceToken(token) {
        this.afAuth.authState.subscribe(user => {
            this.afDatabase.object(`users/${user.uid}/deviceToken`).set(token)
        })
    }
    reportChart(key,owner) {
        this.afDatabase.object(`reprotedCharts/${key}`).set(owner)
    }
    reportUser(owner) {
        this.afDatabase.object(`reportedUsers/${owner}`).set(true)
    }
}