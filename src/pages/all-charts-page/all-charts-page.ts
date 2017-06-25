import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: 'page-all-charts-page',
  templateUrl: 'all-charts-page.html',
})
export class AllChartsPage implements OnInit{
  allCharts : FirebaseListObservable<any[]>;
  loading = this.loadingCtrl.create({
      content : 'Loading Charts',
      spinner : 'bubbles',
    })
  constructor(public navCtrl: NavController, public navParams: NavParams, private afDatabase : AngularFireDatabase,
              private afAuth : AngularFireAuth, private loadingCtrl : LoadingController) {
  }

  ngOnInit(){
    this.loading.present();
    this.allCharts = this.afDatabase.list('allCharts');
  }
  ionViewDidEnter(){
    this.loading.dismiss();
  }
}
