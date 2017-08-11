import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-sharing-instruction',
  templateUrl: 'sharing-instruction.html',
})
export class SharingInstructionPage {
  toShow = false;
  constructor(private viewCtrl : ViewController, public navParams: NavParams, private platform : Platform) {
  }
  onOk(){
    this.viewCtrl.dismiss(this.toShow);
  }
}
