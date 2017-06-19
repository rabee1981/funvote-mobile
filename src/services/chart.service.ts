

import { Injectable, OnInit } from "@angular/core";
import { ChartDetails } from "../data/chartDetails";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { AuthService } from "./auth.service";
import 'rxjs/add/operator/map';

@Injectable()
export class ChartService {
    useruid;
    constructor(private afDatabase: AngularFireDatabase, private authService: AuthService) { }
    saveChart(chartDetails : ChartDetails){
        chartDetails.chartData = [0,0,0,0];
        chartDetails.owner = this.useruid;
        return this.afDatabase.list(`allCharts`).push(chartDetails).then(
            res => {
                this.afDatabase.object(`users/${this.useruid}/usersCharts/${res.key}`).set(true);
            }
        );
    }
    voteFor(key,data){
        this.afDatabase.object(`allCharts/${key}/chartData`).set(data);
    }
    deleteChart(key){
        this.afDatabase.object(`allCharts/${key}`).remove().then(
            res => {
                this.afDatabase.object(`users/${this.useruid}/usersCharts/${key}`).remove();
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
}