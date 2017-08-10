import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LoadingController, Platform } from 'ionic-angular';
import { ShareVia } from "../data/shareVia.enum";
import { Clipboard } from '@ionic-native/clipboard';

@Injectable()
export class SharingService {
  constructor(private platform: Platform, private http: Http, private socialSharing: SocialSharing,
              private afAuth : AngularFireAuth, private clipboard : Clipboard){}

    share(via : ShareVia, key,base64){
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
                  //TODO generate new app link can be don in https://developers.facebook.com/quickstarts/304302026657534/?platform=app-links-host
                  let shortUrl = "fb.me/344033696017700?id=" + 'sss' +key + 'eee' // start/end  
                  var message = shortUrl;
                  switch(via){
                    case ShareVia.FACEBOOK : {
                      return this.facebookSharing(base64,shortUrl,message)
                    }
                    case ShareVia.INSTAGRAM : {
                      return this.instagramSharing(base64,shortUrl,message)
                    }
                    case ShareVia.TWITTER : {
                      return this.twitterSharing(base64,shortUrl,message)
                    }
                    case ShareVia.WHATSAPP : {
                      return this.whatsappSharing(base64,shortUrl,message)
                    }
                  }
        //         })
        // })
    }
    facebookSharing(base64,shortUrl,message){
        this.clipboard.copy(message)
        return this.socialSharing.shareViaFacebookWithPasteMessageHint(null,base64,null,'please click paste')
    }
    instagramSharing(base64,shortUrl,message){
      //TODO
    }
    twitterSharing(base64,shortUrl,message){
      //TODO
    }
    whatsappSharing(base64,shortUrl,message){
     return this.socialSharing.shareViaWhatsApp(message,base64)
    }
}