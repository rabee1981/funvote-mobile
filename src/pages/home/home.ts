import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { AuthService } from "../../services/auth.service";
import { AngularFireAuth } from "angularfire2/auth";
import { ChartFormPage } from "../chart-form-page/chart-form-page";
import { ChartService } from "../../services/chart.service";
import { AngularFireDatabase } from "angularfire2/database";
import { ConnectivityService } from "../../services/ConnectivityService";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit,OnDestroy{
  isAllowCreate;
  userCharts : any[] = [];
  isAllowCreateSubscription : Subscription;
  userStateSubscription : Subscription;
  userChartsSubscription : Subscription;
  loading = this.loadingCtrl.create({
      content : 'Loading Charts',
      spinner : 'bubbles',
    });
  constructor(public navCtrl: NavController, private authService : AuthService ,private afAuth : AngularFireAuth
              ,private chartService : ChartService, private afDatabase: AngularFireDatabase, private loadingCtrl : LoadingController
              ,private conService : ConnectivityService, private alertCtrl : AlertController) {
  }
  ngOnInit(){
    if(this.conService.isOnline()){
    this.loading.present();
    this.userStateSubscription = this.authService.getUserState().subscribe(
      user => {
        if(!user){
          this.loading.dismiss();
          return;
        }
        this.userChartsSubscription = this.chartService.getUserCharts().subscribe(
          charts => {
            this.loading.dismiss();
            this.userCharts = charts;
          }
        )
        this.isAllowCreateSubscription = this.chartService.isAllowToCreate().subscribe(
          res => {
            this.isAllowCreate = res;
          }
        )
      }
    )
  }
  }
  onCreateChart(){
    if(this.isAllowCreate){
      this.navCtrl.push(ChartFormPage);
    }else{
      var alert = this.alertCtrl.create({
      title: 'Charts Limit',
      subTitle: 'you reached the maximum amount of charts, please delete some charts to be able to add a new chart',
      buttons: ['I will do']
  });
  alert.present();
    }
  }
  ngOnDestroy(){
    if (this.userStateSubscription)
      this.userStateSubscription.unsubscribe();
    if(this.userChartsSubscription)
      this.userChartsSubscription.unsubscribe();
    if(this.isAllowCreateSubscription)
      this.isAllowCreateSubscription.unsubscribe();
    }
    trackByCreatedAt(index,chart){
      return chart ? chart.createdAt : undefined;
    }
}
