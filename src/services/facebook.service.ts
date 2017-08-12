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
    })
    constructor(private http : Http, private authService : AuthService, private loadingCtrl: LoadingController,
     private facebook: Facebook, private socialSharing: SocialSharing, private afDatabase: AngularFireDatabase, private platform : Platform
     ,private alertCtrl : AlertController){}

    saveFriendsInfo(user){
      if(!this.platform.is('cordova')){
        return;
      }
      this.facebook.getAccessToken().then(accessToken =>{
        this.http.get(`https://graph.facebook.com/v2.9/${user.providerData[0].uid}/friends?fields=name,id,picture&access_token=${accessToken}`)
        .take(1).subscribe(
            (res : any) => {
                let freidsArray = JSON.parse(res._body).data;
                for(let key in freidsArray){
                var userInfo : UserInfo = new UserInfo();
                    userInfo.name = freidsArray[key].name,
                    userInfo.pictureUrl = freidsArray[key].picture.data.url,
                    userInfo.facebookUid = freidsArray[key].id,
                this.afDatabase.object(`users/${user.uid}/friendsList/${key}`).update(userInfo)
            }
            }
        )
      }).catch()
    }
    saveUserInfo(firebaseUid){
      if(!this.platform.is('cordova')){
        return;
      }
      this.facebook.api('me/?fields=name,id,picture,email',[])
      .then(
        (res) => {
          this.userInfo.firebaseUid = firebaseUid;
          this.userInfo.facebookUid = res.id;
          this.userInfo.name = res.name;
          this.userInfo.pictureUrl =res.picture.data.url;
          this.userInfo.email = res.email;
          firebase.database().ref('users/'+firebaseUid+'/userInfo').update(this.userInfo);
          firebase.database().ref(`facebookUidVsFirebaseUid/${res.id}`).set(firebaseUid);
        }
      ).catch(
        err => {
          console.log(err)
        }
      )
    }  
}