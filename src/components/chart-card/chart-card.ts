import { Component, Input } from '@angular/core';
import { ChartDetails } from "../../data/chartDetails";
import { ChartService } from "../../services/chart.service";
import { FacebookService } from "../../services/facebook.service";

@Component({
  selector: 'chart-card',
  templateUrl: 'chart-card.html'
})
export class ChartCard {
  chartImage: any;
  @Input() chartDetails;
  @Input() owner;
  @Input() justShow = false;
  isFav;

  constructor(private chartService : ChartService, private fbService : FacebookService) {}
  ngOnInit(){
    this.isFav = this.chartService.isFavor(this.chartDetails.$key);
  }
  onDelete(){
    this.chartService.deleteChart(this.chartDetails.$key);
  }
  favorities(){
      this.chartService.updateFav(this.chartDetails.$key,this.chartDetails);
  }
  onShare(){
    this.chartImage = (document.getElementById(this.chartDetails.$key) as HTMLCanvasElement).toDataURL('image/jpg');
     var blob = this.dataURItoBlob(this.chartImage);
     this.fbService.saveImage(blob,this.chartDetails.$key);
  }
  dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpg' });
}

}
