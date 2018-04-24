import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import { User } from '../../models/user';

@Injectable()
export class FireAuthProvider {

  constructor(private afAuth: AngularFireAuth, private ngFirestore: AngularFirestore) {

  }

  userLogin(user: User){
    return Observable.create(observer => {
      this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password).then((authData) => {
        observer.next(authData);
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

}
