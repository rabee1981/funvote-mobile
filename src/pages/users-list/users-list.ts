import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'users-list',
  templateUrl: 'users-list.html',
})
export class UsersListPage {
  votersListOps
  title
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ngOnInit(){
    this.title = this.navParams.get('title');
    this.votersListOps = this.navParams.get('listOps');
  }
}
