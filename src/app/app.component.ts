import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Platform, MenuController, NavController, AlertController, Alert } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';

import { HomePage } from '../pages/home/home';
import { SigninPage } from "../pages/signin-page/signin-page";
import { AuthService } from "../services/auth.service";
import { ChartService } from "../services/chart.service";
import { AllChartsPage } from "../pages/all-charts-page/all-charts-page";
import { FavPage } from "../pages/fav/fav";
import { FacebookService } from "../services/facebook.service";
import { FriendsChartsPage } from "../pages/friends-charts/friends-charts";
import { ConnectivityService } from "../services/ConnectivityService";
import { Network } from "@ionic-native/network";

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, OnDestroy{
  alert: Alert;
  connectSubscription: any;
  disconnectSubscription: any;
  homePage = HomePage;
  rootPage:any = this.homePage;
  signinPage;
  allChartsPage;
  favPage;
  friendsChartsPage;
  userName = [];
  connectionAlert;
  @ViewChild('nav') nav : NavController;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private afAuth : AngularFireAuth
  ,private authService : AuthService, private menuCtrl : MenuController, private chartService : ChartService, private fbService : FacebookService
  ,private alertCtrl : AlertController,private conService : ConnectivityService, private network : Network) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  ngOnInit(){
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.connectionAlert = this.alertCtrl.create({
    title: 'Connection error',
    subTitle: 'Unable to connect with the server. Check your internet connection and try agin.',
    enableBackdropDismiss : false
    });
  this.connectionAlert.present();
});
  this.connectSubscription = this.network.onConnect().subscribe(() => {
  this.connectionAlert.dismiss();
});
    if(this.conService.isOnline){
      this.signinPage = SigninPage;
      this.allChartsPage = AllChartsPage;
      this.favPage = FavPage;
      this.friendsChartsPage = FriendsChartsPage;
        this.afAuth.authState.subscribe(user => {
        if (user) {   
          this.chartService.useruid = user.uid;
          this.userName = user.displayName.split(' ');
          this.rootPage = this.homePage;
          this.fbService.saveFriendsInfo(); 
          this.fbService.saveUserInfo(user.uid);
          this.fbService.friendsFirebaseUid(user.uid);      
        }else{
        this.rootPage =  this.signinPage; 
        }  
    });
    }
  }
  onLogout(){
    this.authService.logout();
    this.menuCtrl.close();
  }
  onLoad(page : any){
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }
  ngOnDestroy(): void {
    this.disconnectSubscription.unsubscribe();
    this.connectSubscription.unsubscribe();
  }
}

