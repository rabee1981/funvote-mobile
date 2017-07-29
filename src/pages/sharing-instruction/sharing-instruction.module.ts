import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharingInstructionPage } from './sharing-instruction';

@NgModule({
  declarations: [
    SharingInstructionPage,
  ],
  imports: [
    IonicPageModule.forChild(SharingInstructionPage),
  ],
  exports: [
    SharingInstructionPage
  ]
})
export class SharingInstructionPageModule {}
