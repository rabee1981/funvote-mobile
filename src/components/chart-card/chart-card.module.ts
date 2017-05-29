import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartCard } from './chart-card';

@NgModule({
  declarations: [
    ChartCard,
  ],
  imports: [
    IonicPageModule.forChild(ChartCard),
  ],
  exports: [
    ChartCard
  ]
})
export class ChartCardModule {}
