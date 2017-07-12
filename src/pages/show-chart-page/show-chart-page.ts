import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ChartDetails } from "../../data/chartDetails";
import { ChartService } from "../../services/chart.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'page-show-chart-page',
  templateUrl: 'show-chart-page.html',
})
export class ShowChartPage {
  chartDetails : ChartDetails;
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
      spinner : 'bubbles',
      content : 'saving your chart'
    })
    loading.present();
    let image = this.chartDetails.backgroundImage;
    this.chartDetails.backgroundImage = null;
    //save chart
    this.chartService.saveChart(this.chartDetails,image).then(
            chart => {
                if(image){
                  //save image to storage
                    this.chartService.saveImage(image,chart.key)
                    .then(imageRef => {
                        // save imageurl to database
                        this.chartService.saveImageURLToDatabase(chart.key,imageRef.downloadURL)
                        .then(
                          res => {
                            loading.dismiss()
                            this.navCtrl.popToRoot()
                          }
                        )
                    })
                }
            }
        );
  }
}
