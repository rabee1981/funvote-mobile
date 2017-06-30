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

    saveFriendsInfo(user){
      this.facebook.getAccessToken().then(accessToken =>{
        this.http.get(`https://graph.facebook.com/v2.9/${user.providerData[0].uid}/friends?fields=name,id,picture&access_token=${accessToken}`)
        .take(1).subscribe(
            (res : any) => {
                console.log(JSON.parse(res._body).data)
                let freidsArray = JSON.parse(res._body).data;
                let userFriendsList : UserInfo[]=[];
                for(let key in freidsArray){
                var userInfo : UserInfo = new UserInfo();
                    userInfo.name = freidsArray[key].name,
                    userInfo.pictureUrl = freidsArray[key].picture.data.url,
                    userInfo.facebookUid = freidsArray[key].id,
                userFriendsList.push(userInfo)
            }
            console.log(userFriendsList)
                this.afDatabase.object(`users/${user.uid}/friendsList`).set(userFriendsList);
            }
        )
      })
    }
    saveUserInfo(firebaseUid){
      this.facebook.api('me/?fields=name,id,picture,email',[])
      .then(
        (res) => {
          this.userInfo.firebaseUid = firebaseUid;
          this.userInfo.facebookUid = res.id;
          this.userInfo.name = res.name;
          this.userInfo.pictureUrl =res.picture.data.url;
          this.userInfo.email = res.email;
          firebase.database().ref('users/'+firebaseUid+'/userInfo').set(this.userInfo);
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