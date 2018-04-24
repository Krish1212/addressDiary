import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditAddPage } from './edit-add';

@NgModule({
  declarations: [
    EditAddPage,
  ],
  imports: [
    IonicPageModule.forChild(EditAddPage),
  ],
})
export class EditAddPageModule {}
