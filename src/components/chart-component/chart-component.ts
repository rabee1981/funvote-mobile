import { ChartDetails } from './../../data/chartDetails';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ChartService } from "../../services/chart.service";
import { AlertController, ModalController } from "ionic-angular";
import { ColorPickerPage } from "../../pages/color-picker/color-picker";
import { Subscription } from "rxjs/Subscription";

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
  titlePadding = 2;
  startFromZero= {xAxes:[],yAxes:[]};
  options={}
  constructor(private chartService : ChartService , private alertCtrl : AlertController, private modalCtrl : ModalController){};

  ngOnInit(){
    this.chartDetails.TitleColor = '#000000'
    this.isvoteSubscribtion = this.chartService.isVote(this.chartDetails.$key)
    .subscribe(res => {
      this.isvote = res.$value
    })
    if(this.chartDetails.chartType=='bar'){
      this.titlePadding = 10
      this.startFromZero = {
        xAxes:[],
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
    //options
    this.options = {
                        layout : {
                          padding : {
                              left: 10,
                              right: 5,
                              top: 0,
                              bottom: 0
                          }
                        },
                        legend : {
                          labels:{padding:5,boxWidth:10}
                        },
                        tooltips: {
                          enabled : false
                        },
                        animation: {
                              duration: 200
                          },
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
                            backgroundColor: '#ffffff'
                        }
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
  this.votesCount = this.chartService.getVoteCount(this.chartDetails.$key,this.chartDetails.owner);
  }
  public vote(index){
    this.chartService.isVote(this.chartDetails.$key)
    .take(1).subscribe(res => {
      if(!res.$value){
      if(!this.justShow){
        this.chartDetails.chartData[index]++;
        this.chartService.voteFor(this.chartDetails.$key,this.chartDetails.chartData,this.chartDetails.owner);
      }else{
        this.chartData = this.chartDetails.chartData.slice();
        this.chartData[index]++;
        this.chartDetails.chartData = this.chartData;
      }
    }
    })
  }
  ngOnDestroy(){
    this.isvoteSubscribtion.unsubscribe()
  }
}
