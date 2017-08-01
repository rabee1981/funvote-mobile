import { AdMobFree } from '@ionic-native/admob-free';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { AuthService } from "../../services/auth.service";
import { AngularFireAuth } from "angularfire2/auth";
import { ChartFormPage } from "../chart-form-page/chart-form-page";
import { ChartService } from "../../services/chart.service";
import { AngularFireDatabase } from "angularfire2/database";
import { ConnectivityService } from "../../services/ConnectivityService";
import { Firebase } from '@ionic-native/firebase';

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
              ,private conService : ConnectivityService, private alertCtrl : AlertController, private fbase : Firebase,
              private platform : Platform, private admobFree : AdMobFree) {
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
            this.userCharts = charts.slice();
          }
        )
      }
    )
  }
  }
  ionViewDidEnter(){
    this.admobFree.banner.hide()
    setTimeout(() => {
      this.admobFree.banner.show()
    }, 500);
  }
  ionViewDidLoad(){
    if(this.platform.is('ios')){
      this.fbase.grantPermission().then(()=>{
      this.fcmInit()
    });
    }else{
      this.fcmInit()
    }
    
    }
  fcmInit(){
    this.fbase.getToken().then(token=>{
          this.chartService.storeDeviceToken(token);
        })

      this.fbase.onNotificationOpen().subscribe(data=>{
        if(data.wasTapped){
          console.log("Received in background");
        } else {
          console.log("Received in foreground");
        };
      })

      this.fbase.onTokenRefresh().subscribe(token=>{
        this.chartService.storeDeviceToken(token);
      })
  }
  onCreateChart(){
    this.isAllowCreateSubscription = this.chartService.isAllowToCreate().take(1).subscribe(
      res => {
        this.isAllowCreate = res;
        if(this.isAllowCreate){
           this.navCtrl.push(ChartFormPage);
        }else{
          var alert = this.alertCtrl.create({
          title: 'Charts Limit',
          subTitle: 'you reached the maximum amount of charts, please delete some charts to be able to add a new one',
          buttons: ['GOT IT']
      });
      alert.present();
        }
      }
    )
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
   //   return chart ? chart.backgroundImage : undefined;
      if(chart){
        if(chart.backgroundImage){
          return chart.backgroundImage
        }
        return chart.createdAt
      }
      return undefined;
    }
}
