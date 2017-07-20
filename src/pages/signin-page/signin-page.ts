import { LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'page-signin-page',
  templateUrl: 'signin-page.html',
})
export class SigninPage {
  constructor(private authService : AuthService, private loadingCtrl : LoadingController) {}
  facebookLogin() {
    var loading = this.loadingCtrl.create({
      content : 'Logging in...',
      spinner : 'bubbles',
    });
    loading.present();
    this.authService.signInWithFacebook().then(res => loading.dismiss())
    .catch(err=>{
      loading.dismiss()
    })
  }
}
