import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, AlertController } from 'ionic-angular';

import { AddProvider } from '../../providers/add/add';

@IonicPage({
  name: 'view-add',
})
@Component({
  selector: 'page-view-add',
  templateUrl: 'view-add.html',
})
export class ViewAddPage {
  item:any;
  loading:Loading;
  addFav:boolean;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingCtrl:LoadingController, 
    public toastCtrl:ToastController, 
    public alertCtrl:AlertController, 
    public adProvider:AddProvider) {
    this.item = this.navParams.get('viewThis');
    this.addFav = this.item.data().favourite;
  }
  deleteAdd(id:string){
    this.loading = this.loadingCtrl.create({
      content: 'Deleting the address...Please wait',
      spinner: 'bubbles',
    });
    this.alertCtrl.create({
      title: 'Delete Confirmation',
      message: 'Do you really want to delete this address?',
      buttons:[{
        text: 'Cancel',
        role: 'cancel',
      },{
        text: 'Mark as deleted',
        handler: () => {
          let updated = this.item.data();
          updated.deleted = true;
          //This will mark the address for deletion and retain in the database
          this.adProvider.updateThisAddress(id,updated).subscribe(success => {
            this.loading.dismiss().then(() => {
              this.toastCtrl.create({
                message: 'Marked for deletion',
                duration:2000,
                position: 'middle',
              }).present();
              this.navCtrl.popToRoot();
            }, failure => {
              this.alertCtrl.create({
                message: 'Error ' + failure.message,
                buttons: [{
                  text: 'Ok',
                  role: 'cancel'
                }]
              }).present();
            });
          });
          this.loading.present();
        }
      }, {
        text:'Delete completely',
        handler: () => {
          //Deleting from the server
          this.adProvider.deleteThisAddress(id).subscribe(success => {
            this.loading.dismiss().then(() => {
              this.toastCtrl.create({
                message: 'Deleted successfully',
                duration: 2000
              }).present();
            });
            this.navCtrl.popToRoot();
          }, failure => {
            this.alertCtrl.create({
              message: 'Error: ' + failure.message,
              buttons: [{
                text: 'Ok',
                role:'cancel'
              }]
            }).present();
          });
          this.loading.present();
        }
      }]
    }).present();
  }
  editAdd(address:any){
    this.toastCtrl.create({
      message: 'Edit record having: ' + address['id'],
      duration: 2000
    }).present();
    //console.log(address.data());
    this.navCtrl.push('edit-add', {'id':address['id'],'thisAddress': address.data()});
  }
  favAdd(id:string,thisFavourite:boolean){
    let updateFavourite:boolean = (thisFavourite) ? false : true;
    this.addFav = updateFavourite;
    let myAddress = this.item.data();
    this.loading = this.loadingCtrl.create({
      content: 'Updating the database...Please wait',
      spinner: 'bubbles',
    });
    myAddress.favourite = updateFavourite;
    //console.log(myAddress.favourite);
    //Updating from the gathered object
    this.adProvider.updateThisAddress(id,myAddress).subscribe(success => {
      //console.log(success);
      this.loading.dismiss().then(() => {
        this.toastCtrl.create({
          message: (updateFavourite) ? 'Marked as your favourite address' : 'Removed from your Favourite address',
          duration: 2000,
          position: 'middle'
        }).present();
        console.log(this.item.data().favourite);
      });
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

}
