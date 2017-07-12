import { ColorPickerPage } from './../color-picker/color-picker';
import { ModalController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ChartDetails } from "../../data/chartDetails";
import { ShowChartPage } from "../show-chart-page/show-chart-page";
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-chart-form-page',
  templateUrl: 'chart-form-page.html',
})
export class ChartFormPage {
  options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      targetHeight: 315,
      targetWidth: 315
    }
  titleColor="#000000"
  valueAxisX: number[] = [];
    chartDetails : ChartDetails = new ChartDetails();
    numberString : string[]=['1','2','3','4'];
    labelPlaceHolder = ['iPhone','HTC','Galaxy','OnePlus']
  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl : ModalController, private camera : Camera) {
    this.chartDetails.chartLabels = [];
    this.chartDetails.chartColor = ['#EA1E63','#3F51B5','#009788','#7E5D4E'];
  }
  onChange(valueString) {
      let value = valueString;
      let values:number[]=[];
      for(let i=1;i<=value;i++){
            values[i-1]=i;
      }
      this.valueAxisX=values;
      
  }
  onShow(){
    this.chartDetails.chartLabels.splice(this.valueAxisX.length);
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
            this.titleColor = color;
            this.chartDetails.titleColor = color;
          }
        })
  }
  loadImage(){
    this.camera.getPicture(this.options)
      .then(img => {
        this.chartDetails.backgroundImage = 'data:image/jpeg;base64,'+img
      })
  }
  
}
