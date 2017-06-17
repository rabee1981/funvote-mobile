import { Facebook } from "@ionic-native/facebook";
import { Http , Response} from "@angular/http";
import { AuthService } from "./auth.service";
import { LoadingController } from "ionic-angular";
import 'rxjs/Rx';
import firebase from 'firebase';
import { Injectable } from "@angular/core";
import { UserInfo } from "../data/userInfo";
import { SocialSharing } from "@ionic-native/social-sharing";

@Injectable()
export class FacebookService {
    friendsList : UserInfo[]=[];
    userInfo : UserInfo = new UserInfo();
    loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    shareMessageSucces = this.loadingCtrl.create({
      spinner : 'hide',
      content: '<p>Shared Successfully</p>'
    });
    constructor(private http : Http, private authService : AuthService, private loadingCtrl: LoadingController, private facebook: Facebook, private socialSharing: SocialSharing){}
    getFriensInfo(){
      this.facebook.api('me/friends/?fields=name,id,picture',[])
      .then(
        res => {
          this.friendsList=[];
          for(let key in res.data){
            let friend = new UserInfo();
            friend.name = res.data[key].name;
            friend.id = res.data[key].id;
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
    getUserInfo(){
      this.facebook.api('me/?fields=name,id,picture',[])
      .then(
        (res) => {
          this.userInfo;
          this.userInfo.id = res.id;
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
    saveImage(image,key){
    this.loading.present();
      var storageRef = firebase.storage().ref();
      storageRef.child('chartsImages/'+key).put(image).then((snapshot) => {
        var url = snapshot.downloadURL;
        this.shareImage(url,key);
      }).catch((error) => {
        console.error('Upload failed:', error);
      });
    }
    shareImage(url,key){
      this.socialSharing.shareViaFacebook(null,url,null)
      .then(res => {
        this.loading.dismiss();
      }).catch(
        err => {
          this.loading.dismiss();
        }
      )
    }
}