import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ChartDetails } from "../../data/chartDetails";
import { ChartService } from "../../services/chart.service";

@Component({
  selector: 'page-show-chart-page',
  templateUrl: 'show-chart-page.html',
})
export class ShowChartPage {
  chartDetails : ChartDetails;
  constructor(public navCtrl: NavController, public navParams: NavParams, private chartService : ChartService,
              private loadingCtrl: LoadingController) {
  }
  ngOnInit(): void {
      this.chartDetails = this.navParams.data;
    }
  onSave(){
    let loading = this.loadingCtrl.create({
      spinner : 'hide',
      content : 'saved successfully'
    })
    this.chartService.saveChart(this.chartDetails)
    .then(
      res => {
        loading.present();
        setTimeout(()=>{
          loading.dismiss();
          this.navCtrl.popToRoot();
        },2000);
      }
    )
  }
}
