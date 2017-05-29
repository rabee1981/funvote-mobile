import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowChartPage } from './show-chart-page';

@NgModule({
  declarations: [
    ShowChartPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowChartPage),
  ],
  exports: [
    ShowChartPage
  ]
})
export class ShowChartPageModule {}
