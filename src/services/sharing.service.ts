import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LoadingController, Platform } from 'ionic-angular';
import { ShareVia } from "../data/shareVia.enum";

@Injectable()
export class SharingService {
  constructor(private platform: Platform, private http: Http, private loadingCtrl: LoadingController
                , private socialSharing: SocialSharing){}

    loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    googleShortenerKey = "AIzaSyBZNC-GL8dUvcXoUxTA1XZa6l8rRhbVOQU";
    googleShortenerUrl = "https://www.googleapis.com/urlshortener/v1/url"
    
    share(via : ShareVia, key,base64){
      this.loading.present();
      var getReq : string = this.googleShortenerUrl+"?key="+this.googleShortenerKey;
      this.http.post(getReq,{"longUrl" : "https://funvaotedata.firebaseapp.com/chart/"+key})
      .subscribe(
        (res : any)=>{
       var shortUrl = JSON.parse(res._body).id;
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
        
      })
    }
    facebookSharing(base64,shortUrl,message){
        this.socialSharing.shareViaFacebookWithPasteMessageHint(message,base64,shortUrl,'please click paste')
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
     //TODO
    }
}