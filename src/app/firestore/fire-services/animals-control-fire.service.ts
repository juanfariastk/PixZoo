import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Animal } from 'src/app/shared/types/animal.type';

@Injectable({
  providedIn: 'root'
})
export class AnimalsControlFireService {

  COLLECTION_NAME = 'animalsList';
  collectionAnimalsList!: AngularFirestoreCollection<Animal>;
  constructor() { }
  
}
