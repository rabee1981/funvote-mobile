import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicChartsPage } from './public-charts-page';

@NgModule({
  declarations: [
    PublicChartsPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicChartsPage),
  ],
  exports: [
    PublicChartsPage
  ]
})
export class PublicChartsPageModule {}
