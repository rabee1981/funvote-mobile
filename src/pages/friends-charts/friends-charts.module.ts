import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendsChartsPage } from './friends-charts';

@NgModule({
  declarations: [
    FriendsChartsPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendsChartsPage),
  ],
  exports: [
    FriendsChartsPage
  ]
})
export class FriendsChartsPageModule {}
