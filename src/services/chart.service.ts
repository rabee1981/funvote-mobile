

import { Injectable, OnInit } from "@angular/core";
import { ChartDetails } from "../data/chartDetails";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { AuthService } from "./auth.service";

@Injectable()
export class ChartService {
    useruid;
    constructor(private afDatabase: AngularFireDatabase, private authService: AuthService) { }
    saveChart(chartDetails : ChartDetails){
        chartDetails.chartData = [0,0,0,0];
        return this.afDatabase.list(`users/${this.useruid}/chartsData`).push(chartDetails);
    }
}