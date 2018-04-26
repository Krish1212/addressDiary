import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

//import { User } from '../../models/user';
import { Address } from '../../models/address';

@Injectable()
export class AddProvider {

  constructor(private afAuth: AngularFireAuth, private afStore: AngularFirestore) {

  }
    //Create
    addNewAddress(address: Address){
        return Observable.create(observer => {
            this.afAuth.authState.subscribe((user) => {
                if(user){
                    this.afStore.collection(`address`).add(address).then((success) => {
                        observer.next(success);
                    }).catch((failure) => {
                        observer.error(failure);
                    });
                }
            });
        });
    }
    //Read
    getAllAddress(){
        return Observable.create(observer => {
            this.afAuth.authState.subscribe(user => {
                if (user){
                    this.afStore.collection(`address`).ref.get().then(success => {
                        observer.next(success);
                }).catch(failure => {
                    observer.error(failure);
                });
                }
            });
        });
    }
    //Update
    updateThisAddress(id:string,newAddress:Address){
        return Observable.create(observer => {
            this.afAuth.authState.subscribe(user => {
                if (user){
                    this.afStore.collection(`address`).ref.doc(`${id}`).update(newAddress).then(success => {
                        observer.next(success);
                }).catch(failure => {
                    observer.error(failure);
                });
                }
            });
        });
    }

    //Delete
    deleteThisAddress(id:string){
        return Observable.create(observer => {
            this.afAuth.authState.subscribe(user => {
                if (user){
                    this.afStore.collection(`address`).doc(id).delete().then(success => {
                        observer.next(success);
                }).catch(failure => {
                    observer.error(failure);
                });
                }
            });
        });
    }

}
