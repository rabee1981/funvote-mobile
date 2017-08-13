import { Subscription } from 'rxjs/Subscription';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: 'public-charts-page',
  templateUrl: 'public-charts-page.html',
})
export class PublicChartsPage {
  publicCharts;
  sortBy = 'createdAt';
  loading = this.loadingCtrl.create({
    content: 'Loading Charts',
    spinner: 'bubbles',
  })
  constructor(public navCtrl: NavController, public navParams: NavParams, private afDatabase: AngularFireDatabase,
    private afAuth: AngularFireAuth, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loading.present();
    this.publicCharts = this.afDatabase.list('publicCharts', {
      query: {
        orderByChild: 'createdAt',
        limitToFirst: 50
      }
    }).do(charts => {
      this.loading.dismiss();
    })

  }
  onChange(event) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading Charts',
      spinner: 'bubbles',
    })
    this.loading.present();
    if (event === 'createdAt') {
      this.publicCharts = this.afDatabase.list('publicCharts', {
        query: {
          orderByChild: 'createdAt',
          limitToFirst: 50
        }
      }).do(charts => {
        this.loading.dismiss();
      })
    } else if (event === 'voteCount') {
      this.publicCharts = this.afDatabase.list('publicCharts', {
        query: {
          orderByChild: 'voteCount',
          limitToFirst: 50
        }
      }).do(charts => {
        this.loading.dismiss();
      })
    }
  }
  trackByCreatedAt(index, chart) {
    return chart ? chart.createdAt : undefined;
  }
}
