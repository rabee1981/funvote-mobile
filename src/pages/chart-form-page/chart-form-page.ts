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
    numberString : string[]=['One','Two','Three','Four'];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.chartDetails.chartLabels = [];
    this.chartDetails.chartColor = ['#EA1E63','#3F51B5','#009788','#7E5D4E'];
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
