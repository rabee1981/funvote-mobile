import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Platform, MenuController, NavController, AlertController, Alert, ModalController } from 'ionic-angular';
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

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{
  alert : Alert;
  connectSubscription: any;
  disconnectSubscription: any;
  homePage = HomePage;
  rootPage:any = this.homePage;
  signinPage = SigninPage;
  allChartsPage = AllChartsPage;
  favPage = FavPage;
  friendsChartsPage = FriendsChartsPage;
  userName = [];
  @ViewChild('nav') nav : NavController;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private afAuth : AngularFireAuth
  ,private authService : AuthService, private menuCtrl : MenuController, private chartService : ChartService, private fbService : FacebookService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  ngOnInit(){
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
  onLogout(){
    this.authService.logout();
    this.menuCtrl.close();
  }
  onLoad(page : any){
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }
}

