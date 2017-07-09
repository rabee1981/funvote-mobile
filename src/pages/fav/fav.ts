import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { AuthService } from "../../services/auth.service";
import { Subscription } from "rxjs/Subscription";
import { ChartService } from "../../services/chart.service";

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
  , private authService : AuthService, private loadingCtrl : LoadingController, private chartService : ChartService) {
  }
  ngOnInit(){
    this.loading.present();
    this.favChartsSubscribtion = this.chartService.getFavoritesCharts().subscribe(
      favCharts => {
        this.favCharts = favCharts;
      }
    )
  }
  ionViewDidEnter(){
    this.loading.dismiss();
  }
  ngOnDestroy(): void {
    this.favChartsSubscribtion.unsubscribe();
  }
  trackByCreatedAt(index,chart){
      return chart ? chart.createdAt : undefined;
    }
}
