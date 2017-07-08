import { ColorPickerPage } from './../color-picker/color-picker';
import { ModalController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ChartDetails } from "../../data/chartDetails";
import { ShowChartPage } from "../show-chart-page/show-chart-page";

@Component({
  selector: 'page-chart-form-page',
  templateUrl: 'chart-form-page.html',
})
export class ChartFormPage {

  valueAxisX: number[] = [];
    chartDetails : ChartDetails = new ChartDetails();
    numberString : string[]=['1','2','3','4'];
    labelPlaceHolder = ['iPhone','HTC','Galaxy','OnePlus']
  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl : ModalController) {
    this.chartDetails.chartLabels = [];
    this.chartDetails.chartColor = ['#EA1E63','#3F51B5','#009788','#7E5D4E'];
  }
  onChange(valueString) {
      console.log(this.chartDetails.chartLabels)
      let value = valueString;
      let values:number[]=[];
      for(let i=1;i<=value;i++){
            values[i-1]=i;
      }
      this.valueAxisX=values;
      
  }
  onShow(){
    this.chartDetails.chartLabels.splice(this.valueAxisX.length);
    console.log(this.chartDetails.chartLabels)
    this.navCtrl.push(ShowChartPage,this.chartDetails);
  }
  changeLabelColor(index){
    const colorPicker = this.modalCtrl.create(ColorPickerPage,{color : this.chartDetails.chartColor[index]});
      colorPicker.present();
      colorPicker.onDidDismiss(
        color => {
          if(color){
            this.chartDetails.chartColor[index] = color;
          }
        })
  }
  changeTitleColor(){
    const colorPicker = this.modalCtrl.create(ColorPickerPage,{color : this.chartDetails.titleColor});
      colorPicker.present();
      colorPicker.onDidDismiss(
        color => {
          if(color){
            this.chartDetails.titleColor = color;
          }
        })
  }
}
