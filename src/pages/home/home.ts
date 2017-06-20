import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AuthService } from "../../services/auth.service";
import { AngularFireAuth } from "angularfire2/auth";
import { ChartFormPage } from "../chart-form-page/chart-form-page";
import { ChartDetails } from "../../data/chartDetails";
import { ChartService } from "../../services/chart.service";
import { FirebaseListObservable, AngularFireDatabase } from "angularfire2/database";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit,OnDestroy{
  userCharts : FirebaseListObservable<ChartDetails[]>;
  userStateSubscription;
  loading = this.loadingCtrl.create({
      content : 'Loading Charts',
      spinner : 'bubbles',
    })
  constructor(public navCtrl: NavController, private authService : AuthService ,private afAuth : AngularFireAuth
              ,private chartService : ChartService, private afDatabase: AngularFireDatabase, private loadingCtrl : LoadingController) {
  }
  ngOnInit(){
    this.loading.present();
    this.userStateSubscription = this.authService.getUserState().subscribe(
      user => {
        this.userCharts = this.afDatabase.list('allCharts',{
          query : {
            orderByChild : 'owner',
            equalTo : user.uid
          }    
        }).map((array) => array.reverse()) as FirebaseListObservable<any[]>
      }
    )
  }
  ionViewDidEnter(){
    this.loading.dismiss();
  }
  ngOnDestroy(){
    this.userStateSubscription.unsubscribe();
  }
  onCreateChart(){
    this.navCtrl.push(ChartFormPage);
  }
}
