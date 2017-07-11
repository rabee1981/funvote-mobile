import { ChartDetails } from './../../data/chartDetails';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ChartService } from "../../services/chart.service";
import { AlertController, ModalController } from "ionic-angular";
import { Subscription } from "rxjs/Subscription";

 declare var Chart:any;

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
  isvote=true;
  titlePadding = 2;
  startFromZero= {xAxes:[],yAxes:[]};
  options={}
  currentData=[];
  backgroundColor;
  constructor(private chartService : ChartService , private alertCtrl : AlertController, private modalCtrl : ModalController){};

  ngOnInit(){
    // this.chartImagBackgroundPlugin()  
    if(!this.chartDetails.backgroundImage){
        this.backgroundColor = '#ffff00';
    }
    this.chartDetails.TitleColor = '#000000'
    this.isvoteSubscribtion = this.chartService.isVote(this.chartDetails.$key)
    .subscribe(res => {
      this.isvote = res.$value
    })
    if(this.chartDetails.chartType=='bar'){
      this.titlePadding = 10
      this.startFromZero = {
        xAxes:[{
            ticks: {
                fontStyle : 'bold',
                fontColor: "#000000",
            }
        }],
        yAxes: [{
            ticks: {
                beginAtZero: true,
                fontStyle : 'bold',
                fontColor: "#000000",
            }
        }]
    }
  }
    //options
    this.options = {
                        legend : {
                          reverse: true,
                          labels:{padding:5,boxWidth:20}
                        },
                        layout : {
                          padding : {
                              left: 10,
                              right: 5,
                              top: 0,
                              bottom: 0
                          }
                        },
                        animateRotate: false,
                        tooltips: {
                          enabled : false
                        },
                        animation: false,
                        title: {
                          text : this.chartDetails.chartTitle,
                          display: true,
                          fontSize: 18,
                          fontFamily: 'Pacifico',
                          padding : this.titlePadding,
                          fontColor : this.chartDetails.titleColor
                        },
                        scales: this.startFromZero,
                        chartArea: {
                            backgroundColor: this.backgroundColor,
                            backgroundImage : this.chartDetails.backgroundImage
                        }
                      }
  this.colors = [
                  {
                    backgroundColor : this.chartDetails.chartColor
                  }
                  ]
  }
  public vote(index){
    this.chartService.isVote(this.chartDetails.$key)
    .take(1).subscribe(res => {
     if(!res.$value){
      if(!this.justShow){
        this.isvote = true;
        this.currentData = this.chartDetails.chartData.slice();
        this.currentData[index]++;
        this.chartDetails.chartData = this.currentData;
        this.chartService.voteFor(this.chartDetails.$key,index,this.chartDetails.owner);
      }else{
        this.chartData = this.chartDetails.chartData.slice();
        this.chartData[index]++;
        this.chartDetails.chartData = this.chartData;
      }
   }
 })
  }
  arraysAreIdentical(arr1, arr2){
    if (arr1.length !== arr2.length) return false;
    for (var i = 0, len = arr1.length; i < len; i++){
        if (arr1[i] !== arr2[i]){
            return false;
        }
    }
    return true; 
  }
  // chartImagBackgroundPlugin(){             
  //     Chart.plugins.register({
  //     beforeDraw: (chart, easing) => {
  //       if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundImage) {
  //           var helpers = Chart.helpers;
  //           var ctx = chart.chart.ctx;
  //           var chartArea = chart.chartArea;
  //           ctx.save();
  //           ctx.fillStyle = chart.config.options.chartArea.backgroundImage;
  //           if(this.chartDetails.backgroundImage){
  //             var image = new Image();
  //             image.onload = () => {
  //               ctx.save();
  //               ctx.globalAlpha = 0.2
  //               ctx.drawImage(image, chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
  //               ctx.globalCompositeOperation='source-over';
  //               ctx.restore()
  //             }              
  //             image.src = this.chartDetails.backgroundImage;
  //           }
  //           ctx.restore();
  //       }
  //      }
  //   });
  // }
  ngOnDestroy(){
    this.isvoteSubscribtion.unsubscribe()
  }
}
