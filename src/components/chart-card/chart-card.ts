import { Subscription } from 'rxjs/Subscription';
import { SharingService } from './../../services/sharing.service';
import { Component, Input, OnDestroy } from '@angular/core';
import { ChartService } from "../../services/chart.service";
import { FacebookService } from "../../services/facebook.service";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { AlertController } from "ionic-angular";
import { AuthService } from "../../services/auth.service";
import { ShareVia } from "../../data/shareVia.enum";

@Component({
  selector: 'chart-card',
  templateUrl: 'chart-card.html'
})
export class ChartCard implements OnDestroy {
  isFavSub: Subscription;
  currentLoveCount: any;
  chartImage: any;
  @Input() chartDetails;
  @Input() owner;
  @Input() justShow = false;
  votesCount;
  ownerInfo;
  isFav;
  isUserChart;

  constructor(private chartService : ChartService, private fbService : FacebookService, private afAuth : AngularFireAuth, private afDatabase : AngularFireDatabase,
              private alertCtrl : AlertController,private authService : AuthService, private sharingService : SharingService) {}
  ngOnInit(){
    this.isFavSub = this.chartService.isFavor(this.chartDetails.$key).subscribe(
      res => {
        this.isFav = res.$value ? true : false;
      }
    );
    this.ownerInfo = this.afDatabase.object(`users/${this.owner}/userInfo`);
    this.isUserChart = (this.owner == this.authService.getCurrentUser().uid)
      // votesCount
  this.votesCount = this.chartDetails.chartData.reduce(
    (a,b) => {
      return a+b;
    }
  )
  this.votesCount = this.chartService.getVoteCount(this.chartDetails.$key,this.chartDetails.owner);
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
      if(this.isFav){
        this.chartDetails.loveCount++;
      }else{
        this.chartDetails.loveCount--;
      }
      this.chartService.updateFav(this.chartDetails.$key,this.chartDetails.owner);
      this.currentLoveCount = this.chartDetails.loveCount;
    }
  }
  onShare(){
    if(!this.justShow){
      this.chartImage = (document.getElementById(this.chartDetails.$key) as HTMLCanvasElement).toDataURL('image/png');
      this.sharingService.share(ShareVia.WHATSAPP,this.chartDetails.$key,this.chartImage)

    }
  }
    ngOnDestroy(): void {
     this.isFavSub.unsubscribe();
  }
}
