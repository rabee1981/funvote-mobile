import { ImageProccessService } from './../../services/imageProccess.service';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ChartService } from "../../services/chart.service";
import { AlertController, ModalController } from "ionic-angular";
import { Subscription } from "rxjs/Subscription";
import { Color } from "ng2-charts";

@Component({
  selector: 'chart-component',
  templateUrl: 'chart-component.html'
})
export class ChartComponent implements OnInit, OnDestroy{
  imageSub: Subscription;
  isvoteSubscribtion: Subscription;
  alert;
  @Input() chartDetails;
  @Input() owner;
  @Input() justShow = false;
  @Output() onVoted = new EventEmitter<boolean>()
  colors : Color[];
  chartData:number[]=[];
  isvote=true;
  titlePadding = 2;
  startFromZero= {xAxes:[],yAxes:[]};
  options={}
  currentData=[];
  axesLabels;
  backgroundImage : any = "data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
  constructor(private chartService : ChartService , private alertCtrl : AlertController, private modalCtrl : ModalController
              ,private imgService : ImageProccessService){};

  ngOnInit(){
    this.axesLabels = this.wrapLabels(this.chartDetails.chartLabels.slice())
    console.log(this.axesLabels)
    if(!this.justShow){
      this.isvoteSubscribtion = this.chartService.isVote(this.chartDetails.$key,this.chartDetails.owner)
      .subscribe(res => {
        this.isvote = res.$value
      })
      this.imageSub = this.chartService.getImageUrl(this.chartDetails.owner,this.chartDetails.$key).subscribe(
      res => {
        if(res.$value){
          this.imgService.convertToDataURLviaCanvas(res.$value, "image/jpeg",1)
              .then( base64Img => {
                this.backgroundImage = base64Img
              }).catch()
        }
      }
    )
    }else{
      if(this.chartDetails.backgroundImage)
        this.backgroundImage = this.chartDetails.backgroundImage;
      this.isvote = false;
    }
    
    this.chartDetails.titleColor = '#000000'
    if(this.chartDetails.chartType==='bar'){
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
                          labels:{
                            padding:5,
                            boxWidth:20,
                            fontStyle : 'bold',
                            fontColor: "#000000"
                          }
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
                            callbacks: {
                              label: function(tooltipItem, data) {
                                var allData = data.datasets[tooltipItem.datasetIndex].data;
                                var tooltipLabel = data.labels[tooltipItem.index];
                                var tooltipData = allData[tooltipItem.index];
                                var total = 0;
                                for (var i in allData) {
                                  total += allData[i];
                                }
                                var tooltipPercentage = Math.round((tooltipData / total) * 100);
                                return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
                              }
                            }
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
                      }
  this.colors= [
                  {
                    backgroundColor : this.chartDetails.chartColor,
                    borderWidth : 0.5
                  }
                  ]
  }
  public vote(index){
    this.chartService.isVote(this.chartDetails.$key,this.chartDetails.owner)
    .take(1).subscribe(res => {
     if(!res.$value){
      if(!this.justShow){
        this.onVoted.emit(true);
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
  // getColorsWithOpacity(colors : string[],opacity : string){
  //   var colorsWithOpacity : string[]=[];
  //   for(var color of colors){
  //     var index = color.indexOf(')');
  //     colorsWithOpacity.push(color.substring(0,index-3)+`,${opacity})`)
  //   }
  //   return colorsWithOpacity;
  // }
  ngOnDestroy(){
    if(!this.justShow){
        this.isvoteSubscribtion.unsubscribe()
        this.imageSub.unsubscribe()
    }
  }
  wrapLabels(labels : string[]){
    let length = labels.length;
    let wrapLabel=[];
    let smallThan =''
    let newItem=[];
    let longWord = length == 2 ? 15 : (length == 3 ? 12 :11)
    for(let key in labels){
      smallThan = ''
      newItem =[]
      let s = labels[key]
      s = s.replace(/  +/g, ' ');
      let splitS = s.split(' ')
      if(s.length<longWord){
        wrapLabel.push(s)
        continue
      }
      for(let i=0;i<splitS.length ; i++){
        if(splitS[i].length>=longWord){
          newItem.push(splitS[0])
          continue
        }
        if(smallThan.length+splitS[i].length+1<longWord){
          smallThan = smallThan + ' ' + splitS[i]
          if(i == splitS.length-1){
            newItem.push(smallThan)
          }
        }else{
          newItem.push(smallThan)
          smallThan = ''
          i--;
        }
      }
      wrapLabel.push(newItem)
    }
    return wrapLabel
  }
}
