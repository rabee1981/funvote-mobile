import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Platform, LoadingController } from 'ionic-angular';
import { ShareVia } from "../data/shareVia.enum";
import { Clipboard } from '@ionic-native/clipboard';

@Injectable()
export class SharingService {
  applink;
  constructor(private platform: Platform, private socialSharing: SocialSharing, private afDatabase: AngularFireDatabase,
    private afAuth: AngularFireAuth, private clipboard: Clipboard) {
      this.afDatabase.object('fbAppLink').take(1).subscribe(url => {
        this.applink = url.$value
      })
     }

  share(via: ShareVia, key, base64) {
      let shortUrl = this.applink + '?id=' + key + 'end' // url = "fb.me/344033696017700"
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