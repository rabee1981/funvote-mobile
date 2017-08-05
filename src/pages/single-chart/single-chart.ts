import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'single-chart',
  segment: 'chart/:id'
})
@Component({
  selector: 'page-single-chart',
  templateUrl: 'single-chart.html',
})
export class SingleChartPage implements OnInit{
  chartDetails;
  constructor(public navCtrl: NavController, public navParams: NavParams, private afDatabase : AngularFireDatabase) {
  }

  ngOnInit() {
    let chartkey = this.navParams.get('id')
    this.afDatabase.object(`publicCharts/${chartkey}`).subscribe(chart => {
      this.chartDetails = chart;
      this.chartDetails.$key = chartkey;
    })
  }

}
