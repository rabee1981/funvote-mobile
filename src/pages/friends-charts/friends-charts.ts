import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { FacebookService } from "../../services/facebook.service";
import { AngularFireDatabase } from "angularfire2/database";


@Component({
  selector: 'page-friends-charts',
  templateUrl: 'friends-charts.html',
})
export class FriendsChartsPage {
  friendsChartsOps=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth : AngularFireAuth, private fbService : FacebookService,
  private afDatabase : AngularFireDatabase) {
  }

  ngOnInit(){
    this.friendsChartsOps = [];
    let friendsfireUid : string[] = this.fbService.friendsfireUid.slice();
    for( let f of friendsfireUid){
      this.friendsChartsOps.push(this.afDatabase.list(`allCharts`, {
        query : {
          orderByChild : 'owner',
          equalTo : f
        }
      }));
    }

  }

}
