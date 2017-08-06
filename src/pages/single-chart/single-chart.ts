import { AuthService } from './../../services/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

@IonicPage({
  name: 'single-chart',
  segment: 'chart/:id'
})
@Component({
  selector: 'page-single-chart',
  templateUrl: 'single-chart.html',
})
export class SingleChartPage implements OnInit, OnDestroy{
  userStateSubscription: Subscription;
  loading = this.loadingCtrl.create({
    content : 'Loading Chart',
    spinner : 'bubbles',
  });
  chartSubscription: Subscription;
  publicChartsthisSub: Subscription;
  chartDetails;
  constructor(public navCtrl: NavController, public navParams: NavParams, private afDatabase : AngularFireDatabase
              , private loadingCtrl : LoadingController, private authService : AuthService) {
  }

  ngOnInit() {
    this.loading.present();
    let chartkey = this.navParams.get('id')
    this.userStateSubscription = this.authService.getUserState().subscribe(
      user => {
    this.chartSubscription = this.afDatabase.object(`users/${user.uid}/friendsCharts/${chartkey}`)
        .subscribe(
          chart => {
            if(chart.$value === undefined){
                this.chartDetails = chart;
                this.loading.dismiss();
            }else{
              this.publicChartsthisSub = this.afDatabase.object(`publicCharts/${chartkey}`).subscribe(publicChart => {
                if(publicChart.$value === undefined){
                  this.chartDetails = publicChart;
                  this.loading.dismiss();
                }else{
                  console.log(publicChart.$value)
                  alert('you can not see this chart, this chart is not public')
                  this.loading.dismiss();
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
    if(this.publicChartsthisSub)
      this.publicChartsthisSub.unsubscribe()
    if(this.chartSubscription)
      this.chartSubscription.unsubscribe()
    if(this.userStateSubscription)
      this.userStateSubscription.unsubscribe()
  }
}
