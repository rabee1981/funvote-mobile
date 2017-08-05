import { Http , Headers} from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { ChartDetails } from './../data/chartDetails';
import { AlertController, LoadingController, LoadingOptions } from 'ionic-angular';
import { FacebookService } from './facebook.service';
import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { AuthService } from "./auth.service";
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import * as firebase from 'firebase';

@Injectable()
export class ChartService {
    useruid;
    alert = this.alertCtrl.create({
        title : 'chart not exist',
        message : 'this chart no longer exist...',
        buttons : ['Ok']
        
    })
    constructor(private afDatabase: AngularFireDatabase, private authService: AuthService, private fbService : FacebookService,
                private alertCtrl : AlertController, private afAuth : AngularFireAuth, private http : Http, private loadingCtrl : LoadingController) { }
    getUserCharts(){
        return this.afDatabase.list(`users/${this.useruid}/userCharts/`,{
          query : {
            orderByChild : 'createdAt',

          }    
        })
    }
    getFavoritesCharts(){ 
        return this.afDatabase.list(`users/${this.useruid}/follow`)
                .map(favKeyArray => {
                    let favCharts = []
                    for(let f of favKeyArray){
                        this.afDatabase.object(`publicCharts/${f.$key}`).subscribe(res => {
                            let index = favCharts.findIndex(chart => {
                                return chart.$key == res.$key
                            })
                            //favorite chart was removed
                            if(res.$value===null){
                                if(index>=0){
                                    favCharts.splice(index,1)
                                }
                            }
                            else{
                                if(index<0){
                                    favCharts.push(res)
                                }else{
                                    favCharts[index] = res;
                                }
                            }
                        })
                    }
                  return favCharts
                })
    }

    getFriendsCharts(){
       return this.afDatabase.list(`users/${this.useruid}/friendsCharts`,{
           query : {
               orderByChild : 'createdAt'
           }
       })
    }
    voteFor(key,index,owner){ // voters is updated just in the user charts its not updates in the publicCharts and friends charts
        let headers = new Headers();
        this.afAuth.auth.currentUser.getIdToken().then(
            token => {
            headers.append('Authorization', 'Bearer '+token)
            this.http.get(`https://us-central1-funvaotedata.cloudfunctions.net/voteFor?owner=${owner}&key=${key}&index=${index}`,{headers : headers})
            .toPromise().then(res => {
                //   console.log(res);
            })
            })
    }
    getVoteCount(key,owner){
        return this.afDatabase.object(`users/${owner}/userCharts/${key}/voteCount`)
    }
    getFollowerCount(key,owner){
        return this.afDatabase.object(`users/${owner}/userCharts/${key}/followerCount`)
    }
    deleteChart(key){
        let loading  = this.loadingCtrl.create({
            content : "deleting chart",
            spinner : 'bubbles'
        })
        loading.present()
        let headers = new Headers();
            this.afAuth.auth.currentUser.getIdToken().then(
                token => {
                headers.append('Authorization', 'Bearer '+token)
                this.http.get(`https://us-central1-funvaotedata.cloudfunctions.net/deleteChart?key=${key}`,{headers : headers})
                .take(1).subscribe(res => {
                    loading.dismiss()
                })
        })
        firebase.storage().ref(`users/${this.useruid}/${key}`).delete()
        .then(()=> console.log('chart photo background was deleted'))
        .catch(()=> console.log('this chart dont have photo background'))
    }
    followChart(key,owner){
        let headers = new Headers();
                this.afAuth.auth.currentUser.getIdToken().then(
                    token => {
                    headers.append('Authorization', 'Bearer '+token)
                    this.http.get(`https://us-central1-funvaotedata.cloudfunctions.net/followChart?owner=${owner}&key=${key}`,{headers : headers})
                    .toPromise().then(res => {
                     //   console.log(res);
                    })
                 })
    }
    isFavor(key){
        return this.afDatabase.object(`users/${this.useruid}/follow/${key}`);
    }
    isVote(key,owner){ // voters is updated just in the user charts its not updates in the publicCharts and friends charts
        return this.afDatabase.object(`users/${owner}/userCharts/${key}/voters/${this.useruid}`);
    }
    isAllowToCreate(){
        return this.afDatabase.list(`users/${this.useruid}/userCharts`).map(
            userCharts => {
                return userCharts.length<4; 
            }
        )
    }
    saveImage(base64,key){
        return firebase.storage().ref().child(`users/${this.useruid}/${key}`).putString(base64,'data_url')
    }
    getImageUrl(owner,key){
        return this.afDatabase.object(`users/${owner}/userCharts/${key}/backgroundImage`);
    }
    saveImageURLToDatabase(key,url){
        return this.afDatabase.object(`users/${this.useruid}/userCharts/${key}/backgroundImage`).set(url)                        
    }
    getListOfFollowers(key,owner){
        return this.afDatabase.list(`users/${owner}/userCharts/${key}/followers`)
        .map(uidList => {
            let followersInfo=[];
            uidList.forEach(useruid => {
                this.afDatabase.object(`users/${useruid.$key}/userInfo`).take(1).subscribe(
                    userInfo => {
                        followersInfo.push({name :userInfo.name, photo : userInfo.pictureUrl});
                    }
                )
            })
            return followersInfo;
        })
    }
    getListOfVoters(key,owner){
        return this.afDatabase.list(`users/${owner}/userCharts/${key}/voters`)
        .map(uidList => {
            let votersInfo=[];
            uidList.forEach(useruid => {
                this.afDatabase.object(`users/${useruid.$key}/userInfo`).take(1).subscribe(
                    userInfo => {
                        votersInfo.push({name :userInfo.name, photo : userInfo.pictureUrl});
                    }
                )
            })
            return votersInfo;
        })
    }
    storeDeviceToken(token){
        this.afAuth.authState.subscribe(user => {
            this.afDatabase.object(`users/${user.uid}/deviceToken`).set(token)
        })
    }
}