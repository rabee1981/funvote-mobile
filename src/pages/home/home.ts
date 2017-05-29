import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from "../../services/auth.service";
import { AngularFireAuth } from "angularfire2/auth";
import { ChartFormPage } from "../chart-form-page/chart-form-page";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private authService : AuthService ,private afAuth : AngularFireAuth) {
  }
  onCreateChart(){
    this.navCtrl.push(ChartFormPage);
  }
}
