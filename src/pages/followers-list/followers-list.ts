import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-followers-list',
  templateUrl: 'followers-list.html',
})
export class FollowersListPage {
  followersList
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(){
    this.followersList = this.navParams.get('followersList');
  }
}
