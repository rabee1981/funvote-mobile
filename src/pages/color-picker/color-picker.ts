import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-color-picker',
  templateUrl: 'color-picker.html',
})
export class ColorPickerPage {
  colorNumber = -1;
  choosenColor;
  opacity = 0.8;
  colors = [`rgba(0, 0, 0,${this.opacity})`,
  `rgba(255, 153, 0,${this.opacity})`,
  `rgba(244, 68, 55,${this.opacity})`,
  `rgba(234, 30, 99,${this.opacity})`,
  `rgba(156, 38, 176,${this.opacity})`,
  `rgba(63, 81, 181,${this.opacity})`,
  `rgba(33, 150, 243,${this.opacity})`,
  `rgba(0, 151, 136,${this.opacity})`,
  `rgba(75, 175, 79,${this.opacity})`,
  `rgba(83, 71, 65,${this.opacity})`,
  `rgba(126, 93, 78,${this.opacity})`,
  `rgba(158, 158, 158,${this.opacity})`]
  constructor(private viewCtrl: ViewController, private navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.choosenColor = this.navParams.get('color');
  }
  onChooseColor(index) {
    this.colorNumber = -1;
    this.colorNumber = index;
    if (this.colorNumber >= 0) {
      this.choosenColor = this.colors[index];
    }
  }
  onCancle() {
    this.viewCtrl.dismiss();
  }
  onOk() {
    this.viewCtrl.dismiss(this.choosenColor);
  }
}
