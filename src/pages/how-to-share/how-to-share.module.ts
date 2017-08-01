import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HowToSharePage } from './how-to-share';

@NgModule({
  declarations: [
    HowToSharePage,
  ],
  imports: [
    IonicPageModule.forChild(HowToSharePage),
  ],
  exports: [
    HowToSharePage
  ]
})
export class HowToSharePageModule {}
