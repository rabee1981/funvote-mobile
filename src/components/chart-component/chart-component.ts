import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ChartService } from "../../services/chart.service";
import { AlertController, ModalController } from "ionic-angular";
import { ColorPickerPage } from "../../pages/color-picker/color-picker";
import { Subscription } from "rxjs/Subscription";

declare var Chart: any;

@Component({
  selector: 'chart-component',
  templateUrl: 'chart-component.html'
})
export class ChartComponent implements OnInit, OnDestroy{
  isvoteSubscribtion: Subscription;
  alert;
  @Input() chartDetails;
  @Input() owner;
  @Input() justShow = false;
  colors;
  chartData:number[]=[];
  votesCount;
  isvote=true;
  startFromZero= {};
  constructor(private chartService : ChartService , private alertCtrl : AlertController, private modalCtrl : ModalController){};
  chartPlugins(){
    Chart.pluginService.register({
    beforeDraw: (chart, easing) => {
        if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
            var helpers = Chart.helpers;
            var ctx = chart.chart.ctx;
            var chartArea = chart.chartArea;

            ctx.save();
            ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
            ctx.fillRect(0,0,600,315);
            ctx.restore();
        }
      }
    });
  }
  ngOnInit(){
    this.chartPlugins()
    this.chartDetails.TitleColor = '#000000'
    this.isvoteSubscribtion = this.chartService.isVote(this.chartDetails.$key)
    .subscribe(res => {
      this.isvote = res.$value
    })
    if(this.chartDetails.chartType=='bar'){
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
    if(!this.isvote){
      this.chartData = this.chartDetails.chartData.slice();
      this.chartData[index]++;
      if(!this.justShow){
        this.chartService.voteFor(this.chartDetails.$key,this.chartData,this.chartDetails.owner,this.votesCount);
      }else{
        this.chartDetails.chartData = this.chartData;
      }
    }
  }
  chartClicked(event){
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
  ngOnDestroy(){
    this.isvoteSubscribtion.unsubscribe()
  }
}
