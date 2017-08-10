import { Deeplinks } from '@ionic-native/deeplinks';
import { SingleChartPage } from './../pages/single-chart/single-chart';
import { HowToSharePage } from './../pages/how-to-share/how-to-share';
import { SharingInstructionPage } from './../pages/sharing-instruction/sharing-instruction';
import { FollowersListPage } from './../pages/followers-list/followers-list';
import { PopoverVotersListPage } from './../pages/popover-voters-list/popover-voters-list';
import { ImageProccessService } from './../services/imageProccess.service';
import { SharingService } from './../services/sharing.service';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ChartsModule } from "ng2-charts";
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ChartComponent } from "../components/chart-component/chart-component";
import { SigninPage } from "../pages/signin-page/signin-page";
import { AuthService } from "../services/auth.service";
import { AngularFireAuth } from "angularfire2/auth";
import { ChartCard } from "../components/chart-card/chart-card";
import { ChartFormPage } from "../pages/chart-form-page/chart-form-page";
import { ShowChartPage } from "../pages/show-chart-page/show-chart-page";
import { ChartService } from "../services/chart.service";
import { PublicChartsPage } from "../pages/public-charts-page/public-charts-page";
import { Facebook } from "@ionic-native/facebook";
import { FacebookService } from "../services/facebook.service";
import { HttpModule } from "@angular/http";
import { SocialSharing } from '@ionic-native/social-sharing';
import { FavPage } from "../pages/fav/fav";
import { FriendsChartsPage } from "../pages/friends-charts/friends-charts";
import { ColorPickerPage } from "../pages/color-picker/color-picker";
import { ConnectivityService } from "../services/ConnectivityService";
import { Network } from "@ionic-native/network";
import { ThousandPipe } from "../pipes/thousand.pipe";
import {Camera} from '@ionic-native/camera';
import { Firebase } from '@ionic-native/firebase';
import { IonicStorageModule } from '@ionic/storage';
import { AdMobFree } from '@ionic-native/admob-free';
import { Clipboard } from '@ionic-native/clipboard';

export const firebaseConfig = {
    apiKey: "AIzaSyDuFurr7wtx_FFUbmnOMMcxKSOPwtnXKFg",
    authDomain: "funvaotedata.firebaseapp.com",
    databaseURL: "https://funvaotedata.firebaseio.com",
    projectId: "funvaotedata",
    storageBucket: "funvaotedata.appspot.com",
    messagingSenderId: "134302046449"
}

@NgModule({
  declarations: [
    MyApp,
    ChartComponent,
    ChartCard,
    HomePage,
    SigninPage,
    ChartFormPage,
    ShowChartPage,
    PublicChartsPage,
    FavPage,
    FriendsChartsPage,
    ColorPickerPage,
    ThousandPipe,
    PopoverVotersListPage,
    FollowersListPage,
    SharingInstructionPage,
    HowToSharePage,
    SingleChartPage,
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SigninPage,
    ChartFormPage,
    ShowChartPage,
    PublicChartsPage,
    FavPage,
    FriendsChartsPage,
    ColorPickerPage,
    PopoverVotersListPage,
    FollowersListPage,
    SharingInstructionPage,
    HowToSharePage,
    SingleChartPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    AngularFireAuth,
    ChartService,
    Facebook,
    FacebookService,
    SocialSharing,
    ConnectivityService,
    Network,
    SharingService,
    Camera,
    ImageProccessService,
    Firebase,
    AdMobFree,
    Deeplinks,
    Clipboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
