import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-sharing-instruction',
  templateUrl: 'sharing-instruction.html',
})
export class SharingInstructionPage {

  constructor(private viewCtrl : ViewController, public navParams: NavParams) {
  }
  onOk(){
    this.viewCtrl.dismiss();
  }
}
