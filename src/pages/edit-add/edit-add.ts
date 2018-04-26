import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, AlertController } from 'ionic-angular';

import { Address } from '../../models/address';
import { AddProvider } from '../../providers/add/add';

@IonicPage({
  name: 'edit-add'
})
@Component({
  selector: 'page-edit-add',
  templateUrl: 'edit-add.html',
})
export class EditAddPage {
  eid:string;
  eAddress = {} as Address;
  loading:Loading;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public adProvider:AddProvider, 
    public loadingCtrl:LoadingController, 
    public toastCtrl:ToastController, 
    public alertCtrl:AlertController) {
    this.eid = this.navParams.get('id');
    this.eAddress = this.navParams.get('thisAddress');
    console.log(this.eAddress);
  }

  ionViewDidLoad() {
  }

  saveEdit(){
    this.loading = this.loadingCtrl.create({
      content: 'Updating the address...Please wait',
      spinner: 'bubbles',
    });
    this.adProvider.updateThisAddress(this.eid,this.eAddress).subscribe(success => {
      //console.log(success);
      this.loading.dismiss().then(() => {
        this.toastCtrl.create({
          message:'Updated address successfully',
          duration: 2000,
          position: 'middle'
        }).present();
        this.navCtrl.popToRoot();
      })
    }, failure => {
      //console.log(failure);
      this.alertCtrl.create({
        message: 'Error: ' + failure.message,
        buttons: [{
          text: 'Ok',
          role: 'cancel',
        }]
      }).present();
    });
    this.loading.present();
  }
  cancelEdit(){

  }

}

