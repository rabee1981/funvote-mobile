import { Http , Headers } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
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
  loading = this.loadingCtrl.create({
      spinner : 'bubbles',
      content : 'saving your chart'
    })
  constructor(public navCtrl: NavController, public navParams: NavParams, private chartService : ChartService,
              private loadingCtrl: LoadingController, private authService : AuthService, private afAuth : AngularFireAuth, private http : Http) {
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
    this.loading.present().then(()=>{
      let image = this.chartDetails.backgroundImage;
    this.chartDetails.backgroundImage = null;
    this.chartDetails.chartData = [0,0,0,0]
    let headers = new Headers();
      this.afAuth.auth.currentUser.getIdToken().then(
        token => {
          headers.append('Authorization', 'Bearer '+token)
          this.http.post('https://us-central1-funvaotedata.cloudfunctions.net/storeChart',this.chartDetails,{headers : headers}).toPromise()
          .then(
            (res : any) => {
              let chartkey = res._body
              if(image){
                  //save image to storage
                    this.chartService.saveImage(image,chartkey)
                    .then(imageRef => {
                        // save imageurl to database
                        this.chartService.saveImageURLToDatabase(chartkey,imageRef.downloadURL)
                        .then(
                          res => {
                            this.navCtrl.popToRoot()
                          }
                        ).catch()
                    }).catch()
                }else{
                    this.navCtrl.popToRoot()
                }
            }
          )
        }
      ).then(err => {
      })
    })
  }
  ionViewWillLeave(){
    this.loading.dismiss()
  }
}
