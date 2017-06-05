import { Component, Input, OnInit } from '@angular/core';
import { Color } from "ng2-charts";
import { ChartDetails } from "../../data/chartDetails";
import { ChartService } from "../../services/chart.service";

@Component({
  selector: 'chart-component',
  templateUrl: 'chart-component.html'
})
export class ChartComponent implements OnInit{
  @Input() chartDetails;
  @Input() owner;
  @Input() justShow = false;
  chartData:number[]=[];
  votesCount;
  isvote=false; 
  public ChartOptions:any = {
    title: {
      text : '',
      display: true,
      fontSize: 18,
      fontFamily: "Pacifico"
    },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
  };

  public ChartLabels:string[] = ['aa','bb'];
  public ChartType:string = 'bar';
  public ChartLegend:boolean = false;
  public Colors:Array<Color>=[
    {
      backgroundColor: [
        '#9b26af',
        '#68efad',
        '#3e50b4',
        '#ff3f80',

  ],
    }
    ];
  public ChartData:number[] = [2,3];
  startFromZero= {};
  constructor(private chartService : ChartService){};
  ngOnInit(){
    this.ChartOptions.title.text = this.chartDetails.chartTitle;
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
  }
  public vote(index){
    this.chartData = this.chartDetails.chartData.slice();
    this.chartData[index]++;
    this.chartDetails.chartData = this.chartData;
    if(!this.justShow){
      this.chartService.voteFor(this.chartDetails.$key,this.chartDetails.chartData);
    }
  }
}
