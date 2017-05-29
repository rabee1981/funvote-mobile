import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChartDetails } from "../../data/chartDetails";

@Component({
  selector: 'page-show-chart-page',
  templateUrl: 'show-chart-page.html',
})
export class ShowChartPage {
  chartDetails : ChartDetails;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  ngOnInit(): void {
      this.chartDetails = this.navParams.data;
    }

}
