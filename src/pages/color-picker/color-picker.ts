import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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
  colorNumber=-1;
  choosenColor;
  colors=['#FFEB3C',
          '#FF9900',
          '#F44437',
          '#EA1E63',
          '#9C26B0',
          '#3F51B5',
          '#2196F3',
          '#009788',
          '#4BAF4F',
          '#534741',
          '#7E5D4E', 
          '#9E9E9E',]
  constructor(private viewCtrl : ViewController,private navParams : NavParams) {
  }

  ionViewDidLoad() {
    this.choosenColor = this.navParams.get('color');
  }
  onChooseColor(index){
    this.colorNumber = -1;
    this.colorNumber = index;
    if(this.colorNumber>=0){
      this.choosenColor = this.colors[index];
    }
  }
  onCancle(){
    this.viewCtrl.dismiss();
  }
  onOk(){
    this.viewCtrl.dismiss(this.choosenColor);
  }
}
