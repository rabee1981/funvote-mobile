import { Component, Input } from '@angular/core';
import { ChartDetails } from "../../data/chartDetails";
import { ChartService } from "../../services/chart.service";
import { FacebookService } from "../../services/facebook.service";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";

@Component({
  selector: 'chart-card',
  templateUrl: 'chart-card.html'
})
export class ChartCard {
  chartImage: any;
  @Input() chartDetails;
  @Input() owner;
  @Input() justShow = false;
  ownerInfo;
  isFav;

  constructor(private chartService : ChartService, private fbService : FacebookService, private afAuth : AngularFireAuth, private afDatabase : AngularFireDatabase) {}
  ngOnInit(){
    this.isFav = this.chartService.isFavor(this.chartDetails.$key);
    this.ownerInfo = this.afDatabase.object(`users/${this.owner}/userInfo`);
  }
  onDelete(){
    if(!this.justShow){
      this.chartService.deleteChart(this.chartDetails.$key);
    }
  }
  favorities(){
    if(!this.justShow){
      this.chartService.updateFav(this.chartDetails.$key,this.chartDetails);
    }
  }
  onShare(){
    if(!this.justShow){
      this.chartImage = (document.getElementById(this.chartDetails.$key) as HTMLCanvasElement).toDataURL('image/jpg');
      var blob = this.dataURItoBlob(this.chartImage);
      this.fbService.saveImage(blob,this.chartDetails.$key);
    }
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
