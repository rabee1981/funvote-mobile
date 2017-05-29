import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChartDetails } from "../../data/chartDetails";
import { ShowChartPage } from "../show-chart-page/show-chart-page";

/**
 * Generated class for the ChartFormPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-chart-form-page',
  templateUrl: 'chart-form-page.html',
})
export class ChartFormPage {

  valueAxisX: number[] = [];
    chartDetails : ChartDetails = new ChartDetails();
    numberString : string[]=['One','Two','Three','Four'];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.chartDetails.chartLabels = [];
    this.chartDetails.chartColor = [ "#e05038", "#334431","#3e50b4","#ff3f80"];
  }
  ionViewDidEnter(){
    this.chartDetails.chartLabels = [];
  }
  onChange(valueString) {
      let value = valueString;
      let values:number[]=[];
      for(let i=1;i<=value;i++){
            values[i-1]=i;
      }
      this.valueAxisX=values.slice();
      
  }
  onShow(){
    this.navCtrl.push(ShowChartPage,this.chartDetails);
  }

}
