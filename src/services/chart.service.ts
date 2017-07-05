import { AlertController } from 'ionic-angular';
import { FacebookService } from './facebook.service';
import { Injectable } from "@angular/core";
import { ChartDetails } from "../data/chartDetails";
import { AngularFireDatabase } from "angularfire2/database";
import { AuthService } from "./auth.service";
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

@Injectable()
export class ChartService {
    useruid;
    alert = this.alertCtrl.create({
        title : 'chart not exist',
        message : 'this chart no longer exist...',
        buttons : ['Ok']
        
    })
    constructor(private afDatabase: AngularFireDatabase, private authService: AuthService, private fbService : FacebookService,
                private alertCtrl : AlertController) { }
    getUserCharts(){
        return this.afDatabase.list(`users/${this.useruid}/userCharts/`,{
          query : {
            orderByChild : 'createdAt',

          }    
        })
    }
    getFavoritesCharts(){ 
        return this.afDatabase.list(`users/${this.useruid}/favorites`)
                .map(favKeyArray => {
                    let favCharts = []
                    for(let f of favKeyArray){
                        this.afDatabase.object(`allCharts/${f.$key}`).subscribe(res => {
                            let index = favCharts.findIndex(chart => {
                                return chart.$key == res.$key
                            })
                            //favorite chart was removed
                            if(res.$value===null){
                                this.afDatabase.object(`users/${this.useruid}/favorites/${res.$key}`).remove()
                                .then(response => {
                                    if(index>=0){
                                        favCharts.splice(index,1)
                                    }
                                })
                            }
                            else{
                                if(index<0){
                                    favCharts.push(res)
                                }else{
                                    favCharts[index] = res;
                                }
                            }
                        })
                    }
                  return favCharts
                })
    }

    getFriendsCharts(){
       return this.afDatabase.list(`users/${this.useruid}/friendsCharts`,{
           query : {
               orderByChild : 'createdAt'
           }
       })
    }
    saveChart(chartDetails : ChartDetails){
        chartDetails.chartData = [0,0,0,0];
        chartDetails.owner = this.useruid;
        return this.afDatabase.list(`allCharts`).push(chartDetails).then(
            res => {
                this.afDatabase.object(`users/${this.useruid}/userCharts/${res.key}`).set(chartDetails);
            }
        );
    }
    voteFor(key,data,owner,voteCount){
        this.afDatabase.list(`allCharts/${key}`).take(1).subscribe(res => {
            if(res.length<=0){
                this.alert.present()
            }else{
                this.afDatabase.object(`allCharts/${key}/chartData`).set(data);
                this.afDatabase.object(`allCharts/${key}/voteCount`).set(-1*(voteCount+1));
                this.afDatabase.object(`users/${this.useruid}/voted/${key}`).set(true);
                this.afDatabase.object(`users/${owner}/userCharts/${key}/chartData`).set(data);
                this.afDatabase.object(`users/${owner}/userCharts/${key}/voteCount`).set(-1*(voteCount+1))
            }
        })
    }
    deleteChart(key){
        this.afDatabase.object(`allCharts/${key}`).remove().then(
            res => {
                this.afDatabase.object(`users/${this.useruid}/userCharts/${key}`).remove();
                this.afDatabase.object(`users/${this.useruid}/favorites/${key}`).remove();
            }
        )
    }
    updateFav(key){
        this.afDatabase.object(`users/${this.useruid}/favorites/${key}`).$ref.transaction(
            currentValue => {
                if(currentValue===null){
                    this.afDatabase.object(`users/${this.useruid}/favorites/${key}`).set(true);
                }else{
                    this.afDatabase.object(`users/${this.useruid}/favorites/${key}`).remove()
                }
            }
        )
    }
    isFavor(key){
        return this.afDatabase.object(`users/${this.useruid}/favorites/${key}`);
    }
    isVote(key){
        return this.afDatabase.object(`users/${this.useruid}/voted/${key}`);
    }
    isAllowToCreate(){
        return this.afDatabase.list(`users/${this.useruid}/userCharts`).map(
            userCharts => {
                return userCharts.length<4; 
            }
        )
    }
}