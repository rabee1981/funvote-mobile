import { ChartService } from './../../services/chart.service';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { FacebookService } from "../../services/facebook.service";
import { AngularFireDatabase } from "angularfire2/database";


@Component({
  selector: 'page-friends-charts',
  templateUrl: 'friends-charts.html',
})
export class FriendsChartsPage implements OnInit{
    friendsCharts;
  loading = this.loadingCtrl.create({
      content : 'Loading Charts',
      spinner : 'bubbles',
    })
  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth : AngularFireAuth, private fbService : FacebookService,
  private afDatabase : AngularFireDatabase, private loadingCtrl : LoadingController, private chartService : ChartService) {
  }

  ngOnInit(){
    this.loading.present()
    this.chartService.getFriendsCharts().subscribe(charts => {
      this.friendsCharts = charts;
      this.loading.dismiss()
    })
  }

}
