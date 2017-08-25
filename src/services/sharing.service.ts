import { Http, Headers } from '@angular/http';
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
    private afAuth: AngularFireAuth, private clipboard: Clipboard, private http: Http, private loadingCtrl: LoadingController) {
    // this.afDatabase.object('fbAppLink').take(1).subscribe(url => {
    //   this.applink = url.$value
    // })
  }

  share(via: ShareVia, key, base64) {
    let loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    // let shortUrl = this.applink + '?id=' + key + 'end' // url = "fb.me/344033696017700"
    // var message = shortUrl;
    loading.present()
    let headers = new Headers();
    return this.afAuth.auth.currentUser.getIdToken().then(
      token => {
        headers.append('Authorization', 'Bearer ' + token)
        this.http.get(`https://us-central1-funvaotedata.cloudfunctions.net/getShortLink?key=${key}`, { headers: headers })
          .take(1).subscribe((res: any) => {
            let shortUrl = res._body;
            var message = shortUrl;
            switch (via) {
              case ShareVia.FACEBOOK: {
                return this.facebookSharing(base64, shortUrl, message)
                  .then(_ => { loading.dismiss() })
                  .catch(_ => { loading.dismiss() })
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
      })
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