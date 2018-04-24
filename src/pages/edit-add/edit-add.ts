import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
  name: 'edit-add'
})
@Component({
  selector: 'page-edit-add',
  templateUrl: 'edit-add.html',
})
export class EditAddPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditAddPage');
  }

}
