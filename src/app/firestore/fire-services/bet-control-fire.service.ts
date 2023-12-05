import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { DataBet, DataBetWithDate } from 'src/app/shared/types/dataBet.type';
import { UserFireService } from './user-fire.service';

@Injectable({
  providedIn: 'root'
})
export class BetControlFireService {

  collectionUserBet!: AngularFirestoreCollection<DataBetWithDate>;
  COLLECTION_NAME = 'userBet';

  constructor(private userService: UserFireService, private afs: AngularFirestore) {
    this.collectionUserBet = this.afs.collection<DataBetWithDate>(this.COLLECTION_NAME);
  }

  test(): Observable<any> {
    return this.userService.getCurrentUserAllData();
  }

  createBet(userBet: DataBet) {
    const dataWithDate = {
      ...userBet,
      date: new Date().toLocaleString('pt-BR', { timeZone: 'UTC' }).replace(/\//g, '-').replace(',', ''),
    };
  
    return this.collectionUserBet.add(dataWithDate);
  }
  

  listBets(): Observable<DataBetWithDate[]> {
    const user = this.userService.getCurrentUser();
    const userEmail = user?.email;
    
    if (userEmail) {
      return this.afs.collection<DataBetWithDate>(this.COLLECTION_NAME, (ref) => ref.where('userEmail', '==', userEmail)).valueChanges();
    } else {
      return new Observable<DataBetWithDate[]>();
    }
  }
}
