import { AngularFireAuth } from 'angularfire2/auth';
import { Http , Headers} from '@angular/http';
import { AuthService } from './../../services/auth.service';
import { ImageProccessService } from './../../services/imageProccess.service';
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
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 315,
      correctOrientation: true,

    }
  titleColor="#000000"
  selectedValue = '2';
  valueAxisX: number[] = [1,2];
    chartDetails : ChartDetails = new ChartDetails();
    numberString : string[]=['1','2','3','4'];
    labelPlaceHolder = ['iPhone','HTC','Galaxy','OnePlus']
  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl : ModalController, private camera : Camera
              ,private imgService : ImageProccessService, private authService : AuthService, private http : Http,private  authFire : AngularFireAuth) {
    this.chartDetails.chartLabels = [];
    this.chartDetails.chartColor = ['rgba(234, 30, 99, 0.8)','rgba(63, 81, 181, 0.8)','rgba(0, 151, 136, 0.8)','rgba(126, 93, 78, 0.8)'];
    this.chartDetails.chartType = 'bar'
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
    this.chartDetails.owner = this.authService.getCurrentUser().uid;
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
        let base64 = 'data:image/jpeg;base64,'+img
        this.imgService.convertToDataURLviaCanvas(base64, "image/jpeg",0.6)
              .then( base64WithOpacity => {
                this.chartDetails.backgroundImage = base64WithOpacity
              }).catch()
      }).catch()
  }
  removeImage(){
      this.chartDetails.backgroundImage = null;
    }
}
