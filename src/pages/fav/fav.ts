import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { AuthService } from "../../services/auth.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'page-fav',
  templateUrl: 'fav.html',
})
export class FavPage implements OnDestroy{
  favChartsSubscribtion: Subscription;
  userStateSubscription: any;
  favCharts=[];
  loading = this.loadingCtrl.create({
      content : 'Loading Charts',
      spinner : 'bubbles',
    })
  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth : AngularFireAuth, private afDatabase: AngularFireDatabase
  , private authService : AuthService, private loadingCtrl : LoadingController) {
  }
  ngOnInit(){
    this.loading.present();
    this.userStateSubscription = this.authService.getUserState().subscribe(
      user => {
        this.favChartsSubscribtion = this.afDatabase.list(`users/${user.uid}/favorites`).subscribe(
          favCharts => {
            this.loading.dismiss();
            this.favCharts = favCharts.slice();
          }
        )
      }
    )
  }
  ngOnDestroy(): void {
    this.favChartsSubscribtion.unsubscribe();
  }
}
