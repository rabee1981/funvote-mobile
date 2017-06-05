import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import { ChartDetails } from "../../data/chartDetails";
import { AngularFireAuth } from "angularfire2/auth";
import { Observable } from "rxjs/Observable";
import { ChartDB } from "../../data/chartDB";

@Component({
  selector: 'page-all-charts-page',
  templateUrl: 'all-charts-page.html',
})
export class AllChartsPage implements OnInit{
  allCharts : FirebaseListObservable<any[]>;
  chartsops=[];
  allChartSubscribtion;
  constructor(public navCtrl: NavController, public navParams: NavParams, private afDatabase : AngularFireDatabase,
              private afAuth : AngularFireAuth) {
  }

  ngOnInit(){
    this.allCharts = this.afDatabase.list('allCharts');
  }
}
