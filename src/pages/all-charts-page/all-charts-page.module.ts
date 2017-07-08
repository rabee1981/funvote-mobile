import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllChartsPage } from './all-charts-page';

@NgModule({
  declarations: [
    AllChartsPage,
  ],
  imports: [
    IonicPageModule.forChild(AllChartsPage),
  ],
  exports: [
    AllChartsPage
  ]
})
export class AllChartsPageModule {}
