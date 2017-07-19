import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-popover-voters-list',
  templateUrl: 'popover-voters-list.html',
})
export class PopoverVotersListPage {
  VotersList;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ngOnInit(){
    this.VotersList = this.navParams.get('votersList');
  }
}
