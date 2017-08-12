import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Platform } from 'ionic-angular';
import { ShareVia } from "../data/shareVia.enum";
import { Clipboard } from '@ionic-native/clipboard';

@Injectable()
export class SharingService {
  constructor(private platform: Platform, private socialSharing: SocialSharing, private afDatabase: AngularFireDatabase,
    private afAuth: AngularFireAuth, private clipboard: Clipboard) { }

  share(via: ShareVia, key, base64) {
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
    this.afDatabase.object('fbAppLink').take(1).subscribe(url => {
      let shortUrl = url.$value+ '?id=' + key + 'end' // start/end  
      var message = shortUrl;
      switch (via) {
        case ShareVia.FACEBOOK: {
          return this.facebookSharing(base64, shortUrl, message)
        }
        case ShareVia.INSTAGRAM: {
          return this.instagramSharing(base64, shortUrl, message)
        }
        case ShareVia.TWITTER: {
          return this.twitterSharing(base64, shortUrl, message)
        }
        case ShareVia.WHATSAPP: {
          return this.whatsappSharing(base64, shortUrl, message)
        }
      }
    })
    //         })
    // })
  }
  facebookSharing(base64, shortUrl, message) {
    this.clipboard.copy(message)
    return this.socialSharing.shareViaFacebook(null, base64, null)
  }
  instagramSharing(base64, shortUrl, message) {
    //TODO
  }
  twitterSharing(base64, shortUrl, message) {
    //TODO
  }
  whatsappSharing(base64, shortUrl, message) {
    return this.socialSharing.shareViaWhatsApp(message, base64)
  }
}