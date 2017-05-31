import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
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
export class HomePage implements OnInit{
  userCharts : FirebaseListObservable<ChartDetails[]>;
  constructor(public navCtrl: NavController, private authService : AuthService ,private afAuth : AngularFireAuth
              ,private chartService : ChartService, private afDatabase: AngularFireDatabase) {
  }
  ngOnInit(){
    this.authService.getUserState().subscribe(
      user => {
        this.userCharts = this.afDatabase.list(`users/${user.uid}/chartsData`);
      }
    )
  }
  onCreateChart(){
    this.navCtrl.push(ChartFormPage);
  }
}
