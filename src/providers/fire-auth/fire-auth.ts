import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import { User } from '../../models/user';
import { Profile } from '../../models/userProfile';

@Injectable()
export class FireAuthProvider {

  constructor(private afAuth: AngularFireAuth, private ngFirestore: AngularFirestore) {

  }

  get currentUser():string {
    return this.afAuth.auth.currentUser ? this.afAuth.auth.currentUser.uid : null;
  }

  userLogin(user: User){
    return Observable.create(observer => {
      this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password).then((authData) => {
        this.ngFirestore.collection(`usersProfile`).doc(authData.uid).ref.get().then((userName) => {
          observer.next(userName);
        });
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  userSignup(user:User){
    return Observable.create(observer => {
      this.afAuth.auth.createUserWithEmailAndPassword(user.email,user.password).then((success) => {
        observer.next(success);
      }).catch((failure) => {
        observer.error(failure);
      });
    });
  }

  userSignOut(){
    return this.afAuth.auth.signOut();
  }

  userNameAdd(profile:Profile){
    return Observable.create(observer => {
      this.ngFirestore.collection(`usersProfile`).doc(`${profile.userID}`).set({'userName':profile.userName}).then((success) => {
        observer.next(success);
      }).catch((failure) => {
        observer.error(failure);
      });
    });
  }

}
