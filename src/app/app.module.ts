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
import { AllChartsPage } from "../pages/all-charts-page/all-charts-page";

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
    AllChartsPage
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SigninPage,
    ChartFormPage,
    ShowChartPage,
    AllChartsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    AngularFireAuth,
    ChartService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
