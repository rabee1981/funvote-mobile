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
        return this.afDatabase.list(`users/${this.useruid}/favorites`)
                .map(favKeyArray => {
                    let favCharts = []
                    for(let f of favKeyArray){
                        this.afDatabase.object(`allCharts/${f.$key}`).subscribe(res => {
                            let index = favCharts.findIndex(chart => {
                                return chart.$key == res.$key
                            })
                            //favorite chart was removed
                            if(res.$value===null){
                                this.afDatabase.object(`users/${this.useruid}/favorites/${res.$key}`).remove()
                                .then(response => {
                                    if(index>=0){
                                        favCharts.splice(index,1)
                                    }
                                }).catch()
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
    // saveChart(chartDetails : ChartDetails){
    //     chartDetails.chartData = [0,0,0,0];
    //     chartDetails.owner = this.useruid;
    //     return this.afDatabase.list(`users/${this.useruid}/userCharts`).push(chartDetails)
    // }
    voteFor(key,index,owner){ // voters is updated just in the user charts its not updates in the allCharts and friends charts
        this.afDatabase.list(`allCharts/${key}`).take(1).subscribe(res => {
            if(res.length<=0){
                this.alert.present()
            }else{
                let headers = new Headers();
                this.afAuth.auth.currentUser.getIdToken().then(
                    token => {
                    headers.append('Authorization', 'Bearer '+token)
                    this.http.get(`https://us-central1-funvaotedata.cloudfunctions.net/voteFor?owner=${owner}&key=${key}&index=${index}`,{headers : headers})
                    .toPromise().then(res => {
                        console.log(res);
                    })
        })
            }
        })
    }
    getVoteCount(key,owner){
        return this.afDatabase.object(`users/${owner}/userCharts/${key}/voteCount`)
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
                    console.log(res);
                    loading.dismiss()
                })
        })
        //TODO
    //    this.afDatabase.object(`users/${this.useruid}/favorites/${key}`).remove();
    }
    updateFav(key,owner){
        this.afDatabase.object(`users/${this.useruid}/favorites/${key}`).$ref.transaction(
            currentValue => {
                if(currentValue===null){
                    this.afDatabase.object(`users/${owner}/userCharts/${key}/loveCount`).$ref.transaction(
                        count => {
                            count--;
                            return count;
                        }
                    )
                    this.afDatabase.object(`users/${this.useruid}/favorites/${key}`).set(true);
                }else{
                    this.afDatabase.object(`users/${this.useruid}/favorites/${key}`).remove()
                    this.afDatabase.object(`users/${owner}/userCharts/${key}/loveCount`).$ref.transaction(
                        count => {
                            count++;
                            return count;
                        }
                    )
                }
            }
        )
    }
    isFavor(key){
        return this.afDatabase.object(`users/${this.useruid}/favorites/${key}`);
    }
    isVote(key,owner){ // voters is updated just in the user charts its not updates in the allCharts and friends charts
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
            this.afDatabase.object(`users/${user.uid}/userInfo/deviceToken`).set(token)
        })
    }
}