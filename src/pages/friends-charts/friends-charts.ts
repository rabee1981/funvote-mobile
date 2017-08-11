import { ChartService } from './../../services/chart.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { FacebookService } from "../../services/facebook.service";
import { AngularFireDatabase } from "angularfire2/database";


@Component({
  selector: 'page-friends-charts',
  templateUrl: 'friends-charts.html',
})
export class FriendsChartsPage {
    friendsCharts;
  loading = this.loadingCtrl.create({
      content : 'Loading Charts',
      spinner : 'bubbles',
    })
  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth : AngularFireAuth, private fbService : FacebookService,
  private afDatabase : AngularFireDatabase, private loadingCtrl : LoadingController, private chartService : ChartService) {
  }

  ionViewDidLoad(){
    this.loading.present()
    this.friendsCharts = this.chartService.getFriendsCharts().do(
      charts => {
      this.loading.dismiss()
    },err => {
      this.loading.dismiss()
    })
  }
  trackByCreatedAt(index,chart){
    return chart ? chart.createdAt : undefined;
    }

}
