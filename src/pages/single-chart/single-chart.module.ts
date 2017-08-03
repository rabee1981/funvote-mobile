import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleChartPage } from './single-chart';

@NgModule({
  declarations: [
    SingleChartPage,
  ],
  imports: [
    IonicPageModule.forChild(SingleChartPage),
  ],
  exports: [
    SingleChartPage
  ]
})
export class SingleChartPageModule {}
