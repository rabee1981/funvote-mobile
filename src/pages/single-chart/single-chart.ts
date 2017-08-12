import { AuthService } from './../../services/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, AlertOptions } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage({
  name: 'single-chart',
  segment: 'chart/:id'
})
@Component({
  selector: 'page-single-chart',
  templateUrl: 'single-chart.html',
})
export class SingleChartPage implements OnInit, OnDestroy {
  userChart: Subscription;
  userStateSubscription: Subscription;
  loading = this.loadingCtrl.create({
    content: 'Loading Chart',
    spinner: 'bubbles',
  });
  chartSubscription: Subscription;
  publicChartsthisSub: Subscription;
  chartDetails;
  alertOption: AlertOptions = {
    enableBackdropDismiss: false,
    buttons: [{ text: 'OK', role: 'cancle', handler: () => { this.navCtrl.popToRoot() } }]
  };
  alert
  constructor(public navCtrl: NavController, public navParams: NavParams, private afDatabase: AngularFireDatabase, private storage: Storage
    , private loadingCtrl: LoadingController, private authService: AuthService, private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.loading.present();
    this.storage.get('isFirstRun').then(value => {
      if (!value) {
        this.loadChart()
      } else {
        setTimeout(() => {
          this.loadChart()

        }, 3000);
      }
    }).then(_=>{
      this.storage.set('isFirstRun',false)
    })
  }
  loadChart() {
    let chartkey = this.navParams.get('id')
    this.userStateSubscription = this.authService.getUserState().subscribe(
      user => {
        this.chartSubscription = this.afDatabase.object(`users/${user.uid}/friendsCharts/${chartkey}`)
          .subscribe(
          chart => {
            if (chart.$value === undefined) {
              this.chartDetails = chart;
              this.loading.dismiss();
            } else {
              this.publicChartsthisSub = this.afDatabase.object(`publicCharts/${chartkey}`).subscribe(publicChart => {
                if (publicChart.$value === undefined) {
                  this.chartDetails = publicChart;
                  this.loading.dismiss();
                } else {
                  this.userChart = this.afDatabase.object(`users/${user.uid}/userCharts/${chartkey}`).subscribe(
                    userChart => {
                      if (userChart.$value === undefined) {
                        this.chartDetails = userChart;
                        this.loading.dismiss()
                      } else {
                        this.loading.dismiss()
                        this.alertOption.subTitle = 'you cannot see this chart, this chart is not public or it has been deleted'
                        this.alert = this.alertCtrl.create(this.alertOption).present()
                      }
                    },
                    err => {
                      this.loading.dismiss()
                      this.alertOption.subTitle = 'oops something went wrong, please try again later'
                      this.alert = this.alertCtrl.create(this.alertOption).present()
                    }
                  )
                }
              })
            }
          },
          err => {
            this.loading.dismiss();
          }
          )
      })
  }
  ngOnDestroy(): void {
    if (this.userChart)
      this.userChart.unsubscribe()
    if (this.publicChartsthisSub)
      this.publicChartsthisSub.unsubscribe()
    if (this.chartSubscription)
      this.chartSubscription.unsubscribe()
    if (this.userStateSubscription)
      this.userStateSubscription.unsubscribe()
  }
}
