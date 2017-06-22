import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ColorPickerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-color-picker',
  templateUrl: 'color-picker.html',
})
export class ColorPickerPage {
  vSign : number[]= [0,0,0,0,0,0,0,0,0,0,0,0];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ColorPickerPage');
  }
  onChooseColor(index){
    this.vSign = [0,0,0,0,0,0,0,0,0,0,0,0];
    this.vSign[index] = 1;
  }
}
