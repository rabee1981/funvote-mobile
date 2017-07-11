
export class ChartDetails{
    chartLabels:string[]=[];
    chartType:string;
    chartData:number[]=[0,0,0,0];
    chartTitle:string;
    chartColor:string[]=[];
    owner : string;
    createdAt = 0-Date.now();
    voteCount = 0;
    titleColor = '#000000';
    loveCount = 0;
    backgroundImage=null;
}
