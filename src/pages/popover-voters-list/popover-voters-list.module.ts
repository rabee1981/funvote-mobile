import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverVotersListPage } from './popover-voters-list';

@NgModule({
  declarations: [
    PopoverVotersListPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverVotersListPage),
  ],
  exports: [
    PopoverVotersListPage
  ]
})
export class PopoverVotersListPageModule {}
