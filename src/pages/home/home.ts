import { Component } from '@angular/core';
import { NavController, Loading, LoadingController, ToastController, AlertController } from 'ionic-angular';

import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { AddProvider } from '../../providers/add/add';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loading:Loading;
  allAddress:any;
  userID: string;

  constructor(public navCtrl: NavController, 
    private afAuth: FireAuthProvider,
    private loadingCtrl:LoadingController,
    private toastCtrl:ToastController,
    private adProvider:AddProvider,
    private alertCtrl:AlertController) {
      this.userID = this.afAuth.currentUser;
  }
  ionViewDidEnter(){
    this.getAllAddress();
  }
  signOut(){
    this.afAuth.userSignOut();
    this.navCtrl.setRoot('login');
  }
  gotoAddNew(){
    this.navCtrl.push('add-new', {'user':this.userID});
  }
  getAllAddress(){
    this.loading = this.loadingCtrl.create({
      content: 'Fetching addresses...Please wait',
      spinner: 'bubbles',
    });
    this.fetchAddress().then((success) => {
      //console.log(this.allAddress);
      this.loading.dismiss().then(() =>{
        this.toastCtrl.create({
          message: 'Address Listed successfully',
          duration: 2000,
          position:'bottom'
        }).present();
      });
    }).catch((failure) => {
      this.alertCtrl.create({
        message: failure.message,
        buttons: [{
          text: 'Ok',
          role: 'cancel'
        }]
      });
    });
    this.loading.present();
  }
  async fetchAddress(){
    this.allAddress = [];
    await this.adProvider.getAllAddress().subscribe(addList => {
      addList.forEach(item => {
        this.allAddress.push(item);
      });
    });
  }

  viewAddress(item:any){
    this.navCtrl.push('view-add', {'viewThis':item});
  }
  filter(ev){
    //re-load all the contacts
    let val = ev.target.value;
    //filter the items here
    if(val && val.trim() != '') {
      this.allAddress = this.allAddress.filter((item) => {
        return (item.data().name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }

  }

}
