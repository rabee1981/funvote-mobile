import { Component, Input, OnInit } from '@angular/core';
import { ChartService } from "../../services/chart.service";
import { AlertController, ModalController } from "ionic-angular";
import { ColorPickerPage } from "../../pages/color-picker/color-picker";

@Component({
  selector: 'chart-component',
  templateUrl: 'chart-component.html'
})
export class ChartComponent implements OnInit{
  alert;
  @Input() chartDetails;
  @Input() owner;
  @Input() justShow = false;
  colors;
  chartData:number[]=[];
  votesCount;
  isvote; 
  public ChartLegend:boolean = false;
  startFromZero= {};
  constructor(private chartService : ChartService , private alertCtrl : AlertController, private modalCtrl : ModalController){};
  ngOnInit(){
    this.isvote = this.chartService.isVote(this.chartDetails.$key);
    if(this.chartDetails.chartType=='bar' || this.chartDetails.chartType=='horizontalBar'){
      this.startFromZero = {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
  }
  // votesCount
  this.votesCount = this.chartDetails.chartData.reduce(
    (a,b) => {
      return a+b;
    }
  )
  this.colors = [
                  {
                    backgroundColor : this.chartDetails.chartColor
                  }
                  ]
  }
  public vote(index){
    this.chartData = this.chartDetails.chartData.slice();
    this.chartData[index]++;
    this.chartDetails.chartData = this.chartData;
    if(!this.justShow){
      this.chartService.voteFor(this.chartDetails.$key,this.chartDetails.chartData);
    }
  }
  chartClicked(event){
    console.log(event)
    if(this.justShow && event.active.length>0){
      let dataIndex = event.active[0]._index;
      let chartColor = JSON.parse(JSON.stringify(this.colors)); 
      const colorPicker = this.modalCtrl.create(ColorPickerPage,{color : this.colors[0].backgroundColor[dataIndex]},{
        enableBackdropDismiss : false
      });
      colorPicker.present();
      colorPicker.onDidDismiss(
        color => {
          if(color){
            chartColor[0].backgroundColor[dataIndex] = color;
            this.colors = chartColor;
            this.chartDetails.chartColor = this.colors[0].backgroundColor;
          }
        }
      )
    }
  }
}
