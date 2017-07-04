import { FacebookService } from './facebook.service';
import { Injectable } from "@angular/core";
import { ChartDetails } from "../data/chartDetails";
import { AngularFireDatabase } from "angularfire2/database";
import { AuthService } from "./auth.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/Rx';
import * as firebase from 'firebase/app';
import { Observable } from "rxjs/Rx";

@Injectable()
export class ChartService {
    useruid;
    constructor(private afDatabase: AngularFireDatabase, private authService: AuthService, private fbService : FacebookService) { }
    getUserCharts(){
        return this.afDatabase.list(`users/${this.useruid}/userCharts/`,{
          query : {
            orderByChild : 'createdAt',

          }    
        })
    }
    getFavoritesCharts(){ //TODO chart not updated if any user vote, except the current user
        return this.afDatabase.list(`users/${this.useruid}/favorites`);
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
    voteFor(key,data,owner){
        console.log(this.afDatabase.list(`allCharts/${key}`))
        if(!this.afDatabase.list(`allCharts/${key}`)){ //TODO add alertCtrl to check if chart exist before voting
            alert('this chart no longer exist..')
            return
        }  
        this.afDatabase.object(`allCharts/${key}/chartData`).set(data);
        this.afDatabase.object(`users/${this.useruid}/voted/${key}`).set(true);
        this.afDatabase.object(`users/${owner}/userCharts/${key}/chartData`).set(data);
        this.afDatabase.object(`users/${this.useruid}/favorites/${key}`).$ref.transaction(
            currentValue => {
                if(currentValue!==null){
                    this.afDatabase.object(`users/${this.useruid}/favorites/${key}/chartData`).set(data);
                }
            }
        )
    }
    deleteChart(key){
        this.afDatabase.object(`allCharts/${key}`).remove().then(
            res => {
                this.afDatabase.object(`users/${this.useruid}/userCharts/${key}`).remove();
                this.afDatabase.object(`users/${this.useruid}/favorites/${key}`).remove()
            }
        )
    }
    updateFav(key,chartDetails){
        this.afDatabase.object(`users/${this.useruid}/favorites/${key}`).$ref.transaction(
            currentValue => {
                if(currentValue===null){
                    this.afDatabase.object(`users/${this.useruid}/favorites/${key}`).set(chartDetails);
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