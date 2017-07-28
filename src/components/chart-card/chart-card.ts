import { PopoverVotersListPage } from './../../pages/popover-voters-list/popover-voters-list';
import { Subscription } from 'rxjs/Subscription';
import { SharingService } from './../../services/sharing.service';
import { Component, Input, OnDestroy } from '@angular/core';
import { ChartService } from "../../services/chart.service";
import { FacebookService } from "../../services/facebook.service";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { NavController, AlertController, PopoverController } from "ionic-angular";
import { AuthService } from "../../services/auth.service";
import { ShareVia } from "../../data/shareVia.enum";
import * as html2canvas from "html2canvas"

@Component({
  selector: 'chart-card',
  templateUrl: 'chart-card.html'
})
export class ChartCard implements OnDestroy {
  followerCount=0;
  followerCountSub: Subscription;
  votesCountSub: Subscription;
  isFavSub: Subscription;
  chartImage: any;
  @Input() chartDetails;
  @Input() owner;
  @Input() justShow = false;
  votesCount=0;
  ownerInfo;
  isFav;
  isUserChart;

  constructor(private chartService : ChartService, private fbService : FacebookService, private afAuth : AngularFireAuth, private afDatabase : AngularFireDatabase,
              private alertCtrl : AlertController,private authService : AuthService, private sharingService : SharingService, private navCtrl : NavController) {}
  ngOnInit(){
    this.isFavSub = this.chartService.isFavor(this.chartDetails.$key).subscribe(
      res => {
        this.isFav = res.$value ? true : false;
      }
    );
    this.ownerInfo = this.afDatabase.object(`users/${this.owner}/userInfo`);
    this.isUserChart = (this.owner == this.authService.getCurrentUser().uid)
    if(this.justShow){
            // votesCount
      this.votesCount = -1*this.chartDetails.chartData.reduce(
        (a,b) => {
          return a+b;
        })
    }else{
      this.votesCountSub = this.chartService.getVoteCount(this.chartDetails.$key,this.chartDetails.owner).subscribe(
      count => {
        this.votesCount = count.$value
      }
    )
      this.followerCountSub = this.chartService.getFollwerCount(this.chartDetails.$key,this.chartDetails.owner).subscribe(
        count => {
          this.followerCount = count.$value
          console.log(this.followerCount);
        }
      )
    }
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
        this.followerCount++;
      }else{
        this.followerCount--;
      }
      this.isFav = ! this.isFav
      this.chartService.followChart(this.chartDetails.$key,this.chartDetails.owner);
    }
  }
  onShare(){
    if(!this.justShow){
      html2canvas(document.getElementById(this.chartDetails.$key)).then(
        res => {
          this.chartImage = res.toDataURL('image/png')
          this.sharingService.share(ShareVia.FACEBOOK,this.chartDetails.$key,this.chartImage)
        }
      ).catch()
    }
  }
  listVoters(event){
    if(!this.justShow){
      this.chartService.getListOfVoters(this.chartDetails.$key,this.chartDetails.owner)
      .take(1)
       .subscribe(res => {
      this.navCtrl.push(PopoverVotersListPage, {votersList : res})
    })
    }
  }
  onVoted(event){
    if(event){
      this.votesCount--
    }
  }
  ngOnDestroy(): void {
    if(this.isFavSub)
      this.isFavSub.unsubscribe();
    if(this.votesCountSub)
      this.votesCountSub.unsubscribe()
    if(this.followerCountSub)
      this.followerCountSub.unsubscribe()
  }
}
