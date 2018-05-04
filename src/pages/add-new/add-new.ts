import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';

import { EmailValidator } from '../../validators/email';
import { Address } from '../../models/address';
import { AddProvider } from '../../providers/add/add';


@IonicPage({
  name:'add-new'
})
@Component({
  selector: 'page-add-new',
  templateUrl: 'add-new.html',
})
export class AddNewPage {
    loading:Loading;
    addNewForm:FormGroup;
    name:AbstractControl;
    addrln1:AbstractControl;
    addrln2:AbstractControl;
    locality:AbstractControl;
    city:AbstractControl;
    pincode:AbstractControl;
    landline:AbstractControl;
    mobile:AbstractControl;
    email:AbstractControl;
    error:any;
    address = {} as Address;
    userID:string;
  
    constructor(public navCtrl: NavController, 
      public navParams:NavParams,
      private formBuilder: FormBuilder,
      private loadingCtrl: LoadingController,
      private alertCtrl: AlertController,
      private adProvider:AddProvider) {
        this.userID = this.navParams.get('user');
        this.addNewForm = this.formBuilder.group({
          'name':['',Validators.compose([Validators.required])],
          'addrln1':[''],
          'addrln2':[''],
          'locality':['',Validators.compose([Validators.required])],
          'city':['',Validators.compose([Validators.required])],
          'pincode':['',Validators.compose([Validators.required,this.pinValidator.bind(this)])],
          'landline':[''],
          'mobile':['',Validators.compose([Validators.required,this.mobileValidator.bind(this)])],
          'email':['',Validators.compose([Validators.required,EmailValidator.isValid])],
        });
        this.name = this.addNewForm.controls['name'];
        this.addrln1 = this.addNewForm.controls['addrln1'];
        this.addrln2 = this.addNewForm.controls['addrln2'];
        this.locality = this.addNewForm.controls['locality'];
        this.city = this.addNewForm.controls['city'];
        this.pincode = this.addNewForm.controls['pincode'];
        this.landline = this.addNewForm.controls['landline'];
        this.mobile = this.addNewForm.controls['mobile'];
        this.email = this.addNewForm.controls['email'];
    }
    addNew(){
      this.loading = this.loadingCtrl.create({
        content: 'Loading...Please wait',
        spinner: 'bubbles',
      });
      if(this.addNewForm.valid){
        this.address = {'name':this.name.value,'addrln1':this.addrln1.value,'addrln2':this.addrln2.value,'locality':this.locality.value,'city':this.city.value,'pincode':this.pincode.value,'landline':this.landline.value,'mobile':this.mobile.value,'email':this.email.value,"deleted":false, "favourite":false, "creator":this.userID};
        this.adProvider.addNewAddress(this.address).subscribe(addr => {
          if(addr) {
            this.loading.dismiss().then(() => {
              this.alertCtrl.create({
                message: "New Address Added successfully",
                buttons: [{
                  text: 'Ok',
                  role: 'cancel'
                }]
              }).present();
            });
            this.resetForm();
            this.navCtrl.popToRoot();
          }
        }, addrError => {
          this.alertCtrl.create({
            message: "Error!" + addrError.message,
            buttons: [{
              text: 'Ok',
              role: 'cancel'
            }]
          });
          this.error = addrError;
        });
        this.loading.present();
      }
    }
    resetForm(){
      this.addNewForm.reset();
    }
    //Need to use this Name Validator some time later
    /*nameValidator(control:FormControl):{[s:string]:boolean}{
      if(control.value !== ""){
        if(!control.value.match("^[a-zA-Z ,.'-]+$")){
          return {invalidName:true};
        }
      }
    }*/
    //Pincode Validator
    pinValidator(control:FormControl):{[s: string]:boolean}{
      if(control.value !== '' && control.value !== null){
        if(!control.value.match('\\d{6}')){
          return {invalidPincode:true};
        }
      }
    }
    //Mobile Validator
    mobileValidator(control:FormControl):{[s:string]:boolean}{
      if(control.value !== '' && control.value !== null){
        if(!control.value.match('\\d{10}')){
          return {invalidPhone:true};
        }
      }
    }
  
  }
