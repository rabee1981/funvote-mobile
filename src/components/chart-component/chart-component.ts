import { ChartDetails } from './../../data/chartDetails';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ChartService } from "../../services/chart.service";
import { AlertController, ModalController } from "ionic-angular";
import { Subscription } from "rxjs/Subscription";

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
  colors;
  chartData:number[]=[];
  isvote=true;
  titlePadding = 2;
  startFromZero= {xAxes:[],yAxes:[]};
  options={}
  currentData=[];
  backgroundImage;
  constructor(private chartService : ChartService , private alertCtrl : AlertController, private modalCtrl : ModalController){};

  ngOnInit(){  
    if(!this.justShow){
      this.imageSub = this.chartService.getImageUrl(this.chartDetails.owner,this.chartDetails.$key).subscribe(
      res => {
        if(res.$value){
          this.convertToDataURLviaCanvas(res.$value, "image/jpeg")
              .then( base64Img => {
                this.backgroundImage = base64Img
              })
              // this.backgroundImage = res.$value;
        }else{
              this.backgroundImage = "data:image/gif;base64,R0lGODlhWAJRAYAAAP///wAAACH5BAEAAAAALAAAAABYAlEBAAL/hI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1is1qt9yu9wsOi8fksvmMTqvX7Lb7DY/L5/S6/Y7P6/f8vv8PGCg4SFhoeIiYqLjI2Oj4CBkpOUlZaXmJmam5ydnp+QkaKjpKWmp6ipqqusra6voKGys7S1tre4ubq7vL2+v7CxwsPExcbHyMnKy8zNzs/AwdLT1NXW19jZ2tvc3d7f0NHi4+Tl5ufo6err7O3u7+Dh8vP09fb3+Pn6+/z9/v/w8woMCBBAsaPIgwocKFDBs6fAgxosSJFCtavIgxo8aN/xw7evwIMqTIkSRLmjyJMqXKlSxbunwJM6bMmTRr2ryJM6fOnTx7+vwJNKjQoUSLGj2KNKnSpUybOn0KNarUqVSrWr2KNavWrVy7ev0KNqzYsWTLmj2LNq3atWzbun0LN67cuXTr2r2LN6/evXz7+v0LOLDgwYQLGz6MOLHixYwbO34MObLkyZQrW76MObPmzZw7e/4MOrTo0aRLmz6NOrXq1axbu34NO7bs2bRr276NO7fu3bx7+/4NPLjw4cSLGz+OPLny5cybO38OPbr06dSrW7+OPbv27dy7e/8OPrz48eTLmz+PPr369ezbu38PP778+fTr27+PP7/+/fz7+6T/D2CAAg5IYIEGHohgggouyGCDDj4IYYQSTkhhhRZeiGGGGm7IYYcefghiiCKOSGKJJp6IYooqrshiiy6+CGOMMs5IY4023ohjjjruyGOPPv4IZJBCDklkkUYeiWSSSi7JZJNOPglllFJOSWWVVl6JZZZabslll15+CWaYYo5JZplmnolmmmquyWabbr4JZ5xyzklnnXbeiWeeeu7JZ59+/ilRAQA7";
        }
      }
    )
    }else{
      this.backgroundImage = this.chartDetails.backgroundImage;
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
  convertToDataURLviaCanvas(url, outputFormat){
	return new Promise( (resolve, reject) => {
		let img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = function(){
			let canvas = <HTMLCanvasElement> document.createElement('CANVAS'),
			ctx = canvas.getContext('2d'),
			dataURL;
			canvas.height = 315;
			canvas.width = 315;
			ctx.drawImage(img, 0, 0);
			dataURL = canvas.toDataURL(outputFormat);
			//callback(dataURL);
			canvas = null;
			resolve(dataURL); 
		};
		img.src = url;
	});
}
  ngOnDestroy(){
    this.isvoteSubscribtion.unsubscribe()
    this.imageSub.unsubscribe()
  }
}
