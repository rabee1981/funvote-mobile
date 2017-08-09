import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LoadingController, Platform } from 'ionic-angular';
import { ShareVia } from "../data/shareVia.enum";

@Injectable()
export class SharingService {
  constructor(private platform: Platform, private http: Http, private loadingCtrl: LoadingController
                , private socialSharing: SocialSharing, private afAuth : AngularFireAuth){}

    loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    share(via : ShareVia, key,base64){
      this.loading.present();
      // let headers = new Headers();
      //       this.afAuth.auth.currentUser.getIdToken().then(
      //           token => {
      //           headers.append('Authorization', 'Bearer '+token)
      //           this.http.get(`https://us-central1-funvaotedata.cloudfunctions.net/getShortLink?key=${key}`,{headers : headers})
      //           .take(1).subscribe((res : any) => {
                  // let shortUrl = res._body;
                  // *** for android ****
                  //let shortUrl = "https://fb.me/344016559352747?id=" + key // this just for android TODO generate one for ios in https://developers.facebook.com/quickstarts
                  // *** both *****
                  let shortUrl = "https://fb.me/344033696017700?id=" + key
                  var message = shortUrl;
                  switch(via){
                    case ShareVia.FACEBOOK : {
                      this.facebookSharing(base64,shortUrl,message)
                      break
                    }
                    case ShareVia.INSTAGRAM : {
                      this.instagramSharing(base64,shortUrl,message)
                      break
                    }
                    case ShareVia.TWITTER : {
                      this.twitterSharing(base64,shortUrl,message)
                      break
                    }
                    case ShareVia.WHATSAPP : {
                      this.whatsappSharing(base64,shortUrl,message)
                      break
                    }
                  }
        //         })
        // })
    }
    facebookSharing(base64,shortUrl,message){
        this.socialSharing.shareViaFacebookWithPasteMessageHint(message,base64,null,'please click paste')
        .then(res => {
          this.loading.dismiss();
        }).catch(
          err => {
            this.loading.dismiss();
          }
        )
    }
    instagramSharing(base64,shortUrl,message){
      //TODO
    }
    twitterSharing(base64,shortUrl,message){
      //TODO
    }
    whatsappSharing(base64,shortUrl,message){
     this.socialSharing.shareViaWhatsApp(message,base64)
       .then(res => {
         this.loading.dismiss()
       })
    }
}