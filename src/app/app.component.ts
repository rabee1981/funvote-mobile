import { SingleChartPage } from './../pages/single-chart/single-chart';
import { Deeplinks } from '@ionic-native/deeplinks';
import { HowToSharePage } from './../pages/how-to-share/how-to-share';
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
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

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
  howToSharePage;
  friendsChartsPage;
  userName = [];
  connectionAlert;
  @ViewChild('nav') nav : NavController;
  constructor(private platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private afAuth : AngularFireAuth
  ,private authService : AuthService, private menuCtrl : MenuController, private chartService : ChartService, private fbService : FacebookService
  ,private alertCtrl : AlertController,private conService : ConnectivityService, private network : Network, private admobFree : AdMobFree,
  private deeplinks : Deeplinks) {
    platform.ready().then(() => { 
      this.admobInit()     
      statusBar.styleDefault();
      splashScreen.hide();
      }).catch();

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
      this.howToSharePage = HowToSharePage;
        this.afAuth.authState.subscribe(user => {
        if (user) {   
          this.chartService.useruid = user.uid;
          this.userName = user.displayName.split(' ');
          this.rootPage = this.homePage;
          this.fbService.saveFriendsInfo(user); 
          this.fbService.saveUserInfo(user.uid);
          this.deeplinks.routeWithNavController(this.nav, {
              '/chart/:id': SingleChartPage
            }).subscribe((match) => {
              console.log('Successfully routed', match);
            }, (nomatch) => {
              console.warn('Unmatched Route', nomatch);
            });      
        }else{
        this.rootPage =  this.signinPage; 
        }  
    });
    }
  }
  admobInit(){
    let banner
      let interstitial
      if(this.platform.is('android')){
        banner = 'ca-app-pub-9268480526904407/8370470970'
        interstitial = 'ca-app-pub-9268480526904407/7796891371';
      }else if(this.platform.is('ios')){
        banner = 'ca-app-pub-9268480526904407/2463538177';
        interstitial = 'ca-app-pub-9268480526904407/4843424975';
      }
      let adMobBannerOptions : AdMobFreeBannerConfig = {
        id : banner,
        overlap : false,
        autoShow: true, 
        isTesting:true  // TODO: remove this line when release
      }
      let adMobInterstitialOptions : AdMobFreeBannerConfig = {
        id : interstitial,
        autoShow : false,
        isTesting:true  // TODO: remove this line when release
      }
      // this.admobFree.interstitial.config(adMobInterstitialOptions)
      // this.admobFree.interstitial.prepare()
      // this.admobFree.on('admob.interstitial.events.CLOSE').subscribe(
      //   res => {
      //     this.admobFree.interstitial.config(adMobInterstitialOptions)
      //     this.admobFree.interstitial.prepare().then(res => console.log(res))
      //   }
      // )
      this.admobFree.banner.config(adMobBannerOptions)
      this.admobFree.banner.prepare()
      .catch(err=>console.log(err))
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

