import { SharingInstructionPage } from './../../pages/sharing-instruction/sharing-instruction';
import { UsersListPage } from './../../pages/users-list/users-list';
import { Subscription } from 'rxjs/Subscription';
import { SharingService } from './../../services/sharing.service';
import { Component, Input, OnDestroy } from '@angular/core';
import { ChartService } from "../../services/chart.service";
import { FacebookService } from "../../services/facebook.service";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { NavController, AlertController, ModalController, LoadingController, ActionSheetController } from "ionic-angular";
import { AuthService } from "../../services/auth.service";
import { ShareVia } from "../../data/shareVia.enum";
import * as html2canvas from "html2canvas"
import { Storage } from '@ionic/storage';

@Component({
  selector: 'chart-card',
  templateUrl: 'chart-card.html'
})
export class ChartCard implements OnDestroy {
  followerCount = 0;
  followerCountSub: Subscription;
  votesCountSub: Subscription;
  isFavSub: Subscription;
  chartImage: any;
  @Input() chartDetails;
  @Input() owner;
  @Input() justShow = false;
  votesCount = 0;
  ownerInfo;
  isFav;
  isUserChart;
  reportOptions

  constructor(private chartService: ChartService, private fbService: FacebookService, private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,
    private alertCtrl: AlertController, private authService: AuthService, private sharingService: SharingService, private navCtrl: NavController
    , private modalCtrl: ModalController, private storage: Storage, private loadingCtrl: LoadingController, private actionSheetCtrl: ActionSheetController) { }
  ngOnInit() {
    this.isFavSub = this.chartService.isFavor(this.chartDetails.$key).subscribe(
      res => {
        this.isFav = res.$value ? true : false;
      }
    );
    this.ownerInfo = this.afDatabase.object(`users/${this.owner}/userInfo`);
    this.isUserChart = (this.owner == this.authService.getCurrentUser().uid)
    if (this.justShow) {
      // votesCount
      this.votesCount = -1 * this.chartDetails.chartData.reduce(
        (a, b) => {
          return a + b;
        })
    } else {
      this.votesCountSub = this.chartService.getVoteCount(this.chartDetails.$key, this.chartDetails.owner).subscribe(
        count => {
          this.votesCount = count.$value
        }
      )
      this.followerCountSub = this.chartService.getFollowerCount(this.chartDetails.$key, this.chartDetails.owner).subscribe(
        count => {
          this.followerCount = count.$value
        }
      )
    } 
  }
  onDelete() {
    if (!this.justShow) {
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
  favorities() {
    if (!this.justShow) {
      if (this.isFav) {
        this.followerCount++;
      } else {
        this.followerCount--;
      }
      this.isFav = !this.isFav
      this.chartService.followChart(this.chartDetails.$key, this.chartDetails.owner, this.chartDetails.isPublic);
    }
  }
  onShare() {
    if (!this.justShow) {
      let loading = this.loadingCtrl.create({
        spinner: 'bubbles'
      });
      loading.present()
      this.storage.get('showInstruction').then(
        toShow => {
          if (toShow) {
            this.convertAndShare().then(_ => {
              loading.dismiss()
            }).catch(_=>{
                loading.dismiss()
              })
          } else {
            let sharingInstruction = this.modalCtrl.create(SharingInstructionPage);
            sharingInstruction.present();
            loading.dismiss()
            sharingInstruction.onDidDismiss((isShow) => {
              loading = this.loadingCtrl.create({
                spinner: 'bubbles'
              });
              loading.present()
              this.storage.set('showInstruction', isShow)
              this.convertAndShare().then(_ => {
                loading.dismiss()
              }).catch(_=>{
                loading.dismiss()
              })
            })
          }
        }
      )
    }
  }
  convertAndShare() {
    return html2canvas(document.getElementById(this.chartDetails.$key)).then(
      res => {
        this.chartImage = res.toDataURL('image/png')
        return this.sharingService.share(ShareVia.FACEBOOK, this.chartDetails.$key, this.chartImage) as Promise<any>
      }
    )
  }
  listVoters() {
    if (!this.justShow) {
      let listVoterOps = this.chartService.getListOfVoters(this.chartDetails.$key, this.chartDetails.owner)
      this.navCtrl.push(UsersListPage, { listOps: listVoterOps, title: 'Voters' })
    }
  }
  listFollowers() {
    if (!this.justShow) {
      let listFollowersOps = this.chartService.getListOfFollowers(this.chartDetails.$key, this.chartDetails.owner)
      this.navCtrl.push(UsersListPage, { listOps: listFollowersOps, title: 'Followers' })
    }
  }
  onVoted(event) {
    if (event) {
      this.votesCount--
    }
  }
  report(){
    this.reportOptions = this.actionSheetCtrl.create({
      title: 'Report',
      buttons: [
        {
          text: 'Report chart',
          icon: 'ios-alert-outline',
          handler: () => {
            this.chartService.reportChart(this.chartDetails.$key,this.chartDetails.owner)
          }
        },
        {
          text: 'Report user',
          icon: 'ios-flag-outline',
          handler: () => {
            this.chartService.reportUser(this.chartDetails.owner)
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    });
    this.reportOptions.present()
  }
  ngOnDestroy(): void {
    if (this.isFavSub)
      this.isFavSub.unsubscribe();
    if (this.votesCountSub)
      this.votesCountSub.unsubscribe()
    if (this.followerCountSub)
      this.followerCountSub.unsubscribe()
  }
}
