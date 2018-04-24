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

  constructor(public navCtrl: NavController, 
    private afAuth: FireAuthProvider,
    private loadingCtrl:LoadingController,
    private toastCtrl:ToastController,
    private adProvider:AddProvider,
    private alertCtrl:AlertController) {
  }
  signOut(){
    this.afAuth.userSignOut();
    this.navCtrl.setRoot('login');
  }
  gotoAddNew(){
    this.navCtrl.push('add-new');
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
  deleteAdd(id:string){
    this.alertCtrl.create({
      title: 'Delete Confirmation',
      message: 'Do you really want to delete this address?',
      buttons:[{
        text: 'Cancel',
        role: 'cancel',
      },{
        text:'Agree',
        handler: () => {
          this.loading = this.loadingCtrl.create({
            content: 'Deleting the address...Please wait',
            spinner: 'bubbles',
          });
          //Deleting from the server
          this.adProvider.deleteThisAddress(id).subscribe(success => {
            this.loading.dismiss().then(() => {
              this.toastCtrl.create({
                message: 'Delete record having: ' + id,
                duration: 2000
              }).present();
            });
            //Deleting from the gathered object
            for(var i=0; i<this.allAddress.length; i++){
              if(this.allAddress[i].id == id){
                this.allAddress.splice(i,1);
                break;
              }
            }
          }, failure => {
            this.alertCtrl.create({
              message: 'Error: ' + failure.message,
              buttons: [{
                text: 'Ok',
                role:'cancel'
              }]
            });
          });
          this.loading.present();
        }
      }]
    }).present();
  }
  editAdd(address:object){
    this.toastCtrl.create({
      message: 'Edit record having: ' + address['id'],
      duration: 2000
    }).present();
    this.navCtrl.push('edit-add');
  }

}
