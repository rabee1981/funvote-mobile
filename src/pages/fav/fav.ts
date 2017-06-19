import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'page-fav',
  templateUrl: 'fav.html',
})
export class FavPage {
  userStateSubscription: any;
  favCharts;
  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth : AngularFireAuth, private afDatabase: AngularFireDatabase
  , private authService : AuthService) {
  }
  ngOnInit(){
    this.userStateSubscription = this.authService.getUserState().subscribe(
      user => {
        this.favCharts = this.afDatabase.list(`users/${user.uid}/favorites`);
      }
    )
  }
}
