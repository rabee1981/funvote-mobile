import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, LoadingController} from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: 'page-all-charts-page',
  templateUrl: 'all-charts-page.html',
})
export class AllChartsPage implements OnInit, OnDestroy{
  allChartsByMostVotedSub: Subscription;
  allChartsByNewestSub: Subscription;
  allChartsByNewest;
  allChartsByMostVoted;
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
    this.allChartsByNewestSub = this.afDatabase.list('allCharts',{
      query :{
        orderByChild : 'createdAt'
      }}).subscribe(charts => {
        this.loading.dismiss();
        this.allChartsByNewest = charts
      })
      
  }
  onChange(event){
    this.allChartsByNewest=[];
    this.allChartsByMostVoted=[];
    this.loading = this.loadingCtrl.create({
      content : 'Loading Charts',
      spinner : 'bubbles',
    })
    this.loading.present();
    if(event === 'createdAt'){
      if(this.allChartsByMostVotedSub)
        this.allChartsByMostVotedSub.unsubscribe()
      this.allChartsByNewestSub = this.afDatabase.list('allCharts',{
      query :{
        orderByChild : 'createdAt'
      }}).subscribe(charts => {
        this.loading.dismiss();
        this.allChartsByNewest = charts
      })
    }else if(event === 'voteCount'){
      if(this.allChartsByNewestSub)
        this.allChartsByNewestSub.unsubscribe()
      this.allChartsByMostVotedSub = this.afDatabase.list('allCharts',{
      query :{
        orderByChild : 'voteCount',
      }}).subscribe(charts => {
        this.loading.dismiss();
        this.allChartsByMostVoted = charts
      })
    }
  }
  ngOnDestroy(){
    if(this.allChartsByMostVotedSub)
      this.allChartsByMostVotedSub.unsubscribe()
    if(this.allChartsByNewestSub)
        this.allChartsByNewestSub.unsubscribe()
  }
  trackByCreatedAt(index,chart){
    return chart ? chart.createdAt : undefined;
  }
}
