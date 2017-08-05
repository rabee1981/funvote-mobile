import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, LoadingController} from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: 'public-charts-page',
  templateUrl: 'public-charts-page.html',
})
export class PublicChartsPage implements OnInit, OnDestroy{
  publicChartsByMostVotedSub: Subscription;
  publicChartsByNewestSub: Subscription;
  publicChartsByNewest;
  publicChartsByMostVoted;
  sortBy = 'createdAt';
  loading = this.loadingCtrl.create({
      content : 'Loading Charts',
      spinner : 'bubbles',
    })
  constructor(public navCtrl: NavController, public navParams: NavParams, private afDatabase : AngularFireDatabase,
              private afAuth : AngularFireAuth, private loadingCtrl : LoadingController) {
  }

  ngOnInit(){
    this.loading.present();
    this.publicChartsByNewestSub = this.afDatabase.list('publicCharts',{
      query :{
        orderByChild : 'createdAt',
        limitToFirst : 50
      }}).subscribe(charts => {
        this.loading.dismiss();
        this.publicChartsByNewest = charts
      })
      
  }
  onChange(event){
    this.publicChartsByNewest=[];
    this.publicChartsByMostVoted=[];
    this.loading = this.loadingCtrl.create({
      content : 'Loading Charts',
      spinner : 'bubbles',
    })
    this.loading.present();
    if(event === 'createdAt'){
      if(this.publicChartsByMostVotedSub)
        this.publicChartsByMostVotedSub.unsubscribe()
      this.publicChartsByNewestSub = this.afDatabase.list('publicCharts',{
      query :{
        orderByChild : 'createdAt',
        limitToFirst : 50
      }}).subscribe(charts => {
        this.loading.dismiss();
        this.publicChartsByNewest = charts
      })
    }else if(event === 'voteCount'){
      if(this.publicChartsByNewestSub)
        this.publicChartsByNewestSub.unsubscribe()
      this.publicChartsByMostVotedSub = this.afDatabase.list('publicCharts',{
      query :{
        orderByChild : 'voteCount',
        limitToFirst : 50
      }}).subscribe(charts => {
        this.loading.dismiss();
        this.publicChartsByMostVoted = charts
      })
    }
  }
  ngOnDestroy(){
    if(this.publicChartsByMostVotedSub)
      this.publicChartsByMostVotedSub.unsubscribe()
    if(this.publicChartsByNewestSub)
        this.publicChartsByNewestSub.unsubscribe()
  }
  trackByCreatedAt(index,chart){
    return chart ? chart.createdAt : undefined;
  }
}
