import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

//import { HomePage } from '../home/home';
import { User } from '../../models/user';
import { Profile } from '../../models/userProfile';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { EmailValidator } from '../../validators/email';

@IonicPage({
  name:'register'
})
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  signupForm: FormGroup;
  uname:AbstractControl;
  username: AbstractControl;
  password: AbstractControl;
  loading: Loading;
  user = {} as User;
  userProfile = {} as Profile;
  error: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private frmBuilder:FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private afAuth: FireAuthProvider, 
    private toastCtrl:ToastController) {
      this.signupForm = this.frmBuilder.group({
        'username': ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        'password': ['', Validators.compose([Validators.minLength(6), Validators.required])],
        'name': ['', Validators.compose([Validators.required])],
      });
      this.username = this.signupForm.controls['username'];
      this.password = this.signupForm.controls['password'];
      this.uname = this.signupForm.controls['name'];
  }
  register(){
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'User registration...in progress',
      dismissOnPageChange: true,
    });
    if(this.signupForm.valid){
      this.user = {'email':this.username.value, 'password':this.password.value};
      this.afAuth.userSignup(this.user).subscribe(authUser => {
        this.userProfile = {'userID':authUser.uid,'userName':this.uname.value};
        console.log(authUser.uid);
        this.navCtrl.setRoot('login');
        this.afAuth.userNameAdd(this.userProfile).subscribe(success => {
          this.toastCtrl.create({
            message: 'User Profile created',
            duration: 2000,
            position:'middle',
          }).present();
        }, failure => {
          console.log(failure.errorMessage);
        });
      }, authError => {
        this.loading.dismiss().then(() => {
          let errorMessage: string = authError.message;
          if (authError.code === 'auth/weak-password' || authError.code === 'auth/email-already-in-use'){
            this.alertCtrl.create({
              message: errorMessage,
              buttons: [{
                text: 'Ok',
                role: 'cancel'
              }]
            }).present();
          }
        });
        this.error = authError;
      });
      this.loading.present();
    }
  }

}
