import { AuthService } from './../../services/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, AlertOptions } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, private afDatabase: AngularFireDatabase
    , private loadingCtrl: LoadingController, private authService: AuthService, private alertCtrl: AlertController) {
  }

  ngOnInit() {
    let alertOption: AlertOptions = {
      enableBackdropDismiss: false,
      buttons: [{ text: 'OK', role: 'cancle', handler: () => { this.navCtrl.popToRoot() } }]
    };
    let alert
    this.loading.present();
    setTimeout(() => {
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
                          alertOption.subTitle = 'you cannot see this chart, this chart is not public or it has been deleted'
                          alert = this.alertCtrl.create(alertOption).present()
                        }
                      },
                      err => {
                        this.loading.dismiss()
                        alertOption.subTitle = 'oops something went wrong, please try again later'
                        alert = this.alertCtrl.create(alertOption).present()
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
    }, 3000);

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
