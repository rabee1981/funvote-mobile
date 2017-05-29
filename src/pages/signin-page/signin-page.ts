import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from "../../services/auth.service";



@IonicPage()
@Component({
  selector: 'page-signin-page',
  templateUrl: 'signin-page.html',
})
export class SigninPage {
  constructor(public navCtrl: NavController, public navParams: NavParams, private authService : AuthService) {}
  facebookLogin() {
    this.authService.login();
  }
}
