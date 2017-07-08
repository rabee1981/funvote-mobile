import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartFormPage } from './chart-form-page';

@NgModule({
  declarations: [
    ChartFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ChartFormPage),
  ],
  exports: [
    ChartFormPage
  ]
})
export class ChartFormPageModule {}
