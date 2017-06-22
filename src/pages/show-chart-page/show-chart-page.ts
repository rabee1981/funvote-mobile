import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ChartDetails } from "../../data/chartDetails";
import { ChartService } from "../../services/chart.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'page-show-chart-page',
  templateUrl: 'show-chart-page.html',
})
export class ShowChartPage {
  chartDetails : ChartDetails;
  owner=this.authService.getCurrentUser().uid;
  constructor(public navCtrl: NavController, public navParams: NavParams, private chartService : ChartService,
              private loadingCtrl: LoadingController, private authService : AuthService) {
  }
  ngOnInit(): void {
      this.chartDetails = this.navParams.data;
      switch(this.chartDetails.chartLabels.length){
        case 2 : {
          this.chartDetails.chartData =[1,2,0,0];
          break;
        }
        case 3 : {
          this.chartDetails.chartData =[1,2,3,0];
          break;
        }
        case 4 : {
          this.chartDetails.chartData =[1,2,3,4];
          break;
        }
      }
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
        },1500);
      }
    )
  }
}
