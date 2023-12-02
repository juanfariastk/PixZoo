import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { UserLogged } from 'src/app/shared/types/userLogged.type';

@Injectable({
  providedIn: 'root'
})
export class UserFireService {

  collectionUsers!: AngularFirestoreCollection<UserLogged>;
  COLLECTION_NAME = 'users';

  constructor() { }
}
