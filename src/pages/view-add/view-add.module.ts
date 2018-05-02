import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewAddPage } from './view-add';

@NgModule({
  declarations: [
    ViewAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewAddPage),
  ],
})
export class ViewAddPageModule {}
