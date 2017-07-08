import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartComponent } from './chart-component';

@NgModule({
  declarations: [
    ChartComponent,
  ],
  imports: [
    IonicPageModule.forChild(ChartComponent),
  ],
  exports: [
    ChartComponent
  ]
})
export class ChartComponentModule {}
