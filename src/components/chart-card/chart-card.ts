import { Component, Input } from '@angular/core';
import { ChartService } from "../../services/chart.service";
import { FacebookService } from "../../services/facebook.service";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { AlertController } from "ionic-angular";
import { AuthService } from "../../services/auth.service";

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
  isUserChart;

  constructor(private chartService : ChartService, private fbService : FacebookService, private afAuth : AngularFireAuth, private afDatabase : AngularFireDatabase,
              private alertCtrl : AlertController,private authService : AuthService) {}
  ngOnInit(){
    this.isFav = this.chartService.isFavor(this.chartDetails.$key);
    this.ownerInfo = this.afDatabase.object(`users/${this.owner}/userInfo`);
    this.isUserChart = (this.owner == this.authService.getCurrentUser().uid)
  }
  onDelete(){
    if(!this.justShow){
        var alert = this.alertCtrl.create({
        title: 'Delete Chart',
        message: 'Do you want to Delete this chart?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            handler: () => {
                this.chartService.deleteChart(this.chartDetails.$key);
            }
          }
        ]
      });
      alert.present();
    }
  }
  favorities(){
    if(!this.justShow){
      this.chartService.updateFav(this.chartDetails.$key);
    }
  }
  onShare(){
    if(!this.justShow){
      this.chartImage = (document.getElementById(this.chartDetails.$key) as HTMLCanvasElement).toDataURL('image/jpg');
      this.fbService.shareImage(this.chartDetails.$key,this.chartImage);
    }
  }
}
