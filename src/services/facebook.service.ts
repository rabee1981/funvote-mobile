import { Facebook } from "@ionic-native/facebook";
import { Http } from "@angular/http";
import { AuthService } from "./auth.service";
import { LoadingController } from "ionic-angular";
import 'rxjs/Rx';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import { Injectable } from "@angular/core";
import { UserInfo } from "../data/userInfo";
import { SocialSharing } from "@ionic-native/social-sharing";
import { AngularFireDatabase } from "angularfire2/database";
import { Platform, AlertController } from 'ionic-angular';

@Injectable()
export class FacebookService {
    friendsList : UserInfo[]=[];
    userInfo : UserInfo = new UserInfo();
    friendsfireUid : string[]=[];
    googleShortenerKey = "AIzaSyBZNC-GL8dUvcXoUxTA1XZa6l8rRhbVOQU";
    googleShortenerUrl = "https://www.googleapis.com/urlshortener/v1/url"
    loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    shareMessageSucces = this.loadingCtrl.create({
      spinner : 'hide',
      content: '<p>Shared Successfully</p>'
    });
    constructor(private http : Http, private authService : AuthService, private loadingCtrl: LoadingController,
     private facebook: Facebook, private socialSharing: SocialSharing, private afDatabase: AngularFireDatabase, private platform : Platform
     ,private alertCtrl : AlertController){}
    saveFriendsInfo(){
      this.facebook.api('me/friends/?fields=name,id,picture',[])
      .then(
        res => {
          this.friendsList=[];
          for(let key in res.data){
            let friend = new UserInfo();
            friend.name = res.data[key].name;
            friend.facebookUid = res.data[key].id;
            friend.pictureUrl = res.data[key].picture.data.url;
            this.friendsList.push(friend);
          }
          firebase.database().ref('users/'+this.authService.getCurrentUser().uid+'/friendsList').set(this.friendsList);
        }
      ).catch(
        err => {
          console.log(err);
        }
      );
    }
    saveUserInfo(firebaseUid){
      this.facebook.api('me/?fields=name,id,picture',[])
      .then(
        (res) => {
          this.userInfo.firebaseUid = firebaseUid;
          this.userInfo.facebookUid = res.id;
          this.userInfo.name = res.name;
          this.userInfo.pictureUrl =res.picture.data.url;
          firebase.database().ref('users/'+this.authService.getCurrentUser().uid+'/userInfo').set(this.userInfo);
        }
      ).catch(
        err => {
          console.log(err)
        }
      )
    }
    shareImage(key,base64){
      this.loading.present();
      var getReq : string = this.googleShortenerUrl+"?key="+this.googleShortenerKey;
      this.http.post(getReq,{"longUrl" : "https://funvaotedata.firebaseapp.com/chart/"+key})
      .subscribe(
        (res : any)=>{
       var shortUrl = JSON.parse(res._body).id;
        if(this.platform.is('android')){
        var message = 'please vote here '+shortUrl;
        this.socialSharing.shareViaFacebookWithPasteMessageHint(message,base64,shortUrl,'please click paste')
        .then(res => {
          this.loading.dismiss();
        }).catch(
          err => {
            this.loading.dismiss();
          }
        )
      }else {
          this.socialSharing.shareViaFacebook('please vote here',base64,shortUrl)
        .then(res => {
          this.loading.dismiss();
        }).catch(
          err => {
            this.loading.dismiss();
          }
        )
      }
      })
    }
    friendsFirebaseUid(userUid){
      this.friendsfireUid =[];
      this.afDatabase.list(`users/${userUid}/friendsList`).take(1).subscribe(
        friendsList => {
          friendsList.forEach(
            friend => {
              this.afDatabase.list(`users`,{
              query : {
                orderByChild : 'userInfo/facebookUid',
                equalTo : friend.facebookUid
              }    
            }).take(1).subscribe((res : any)=>{
              this.friendsfireUid.push(res[0].$key);
              this.afDatabase.object(`users/${userUid}/friendsList/${friend.$key}`).update({firebaseUid : res[0].$key})
            })
            }
          )
        }
      )
    }

}