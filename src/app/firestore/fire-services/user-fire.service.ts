import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, from, map, mergeMap, of } from 'rxjs';
import { UserAllData } from 'src/app/shared/types/userAllData.type';
import { UserLogged } from 'src/app/shared/types/userLogged.type';

@Injectable({
  providedIn: 'root'
})
export class UserFireService {

  collectionUsers!: AngularFirestoreCollection<UserLogged>;
  COLLECTION_NAME = 'users';

  currentUserSubject: BehaviorSubject<UserAllData | null>;
  currentUser: Observable<UserAllData | null>;

  constructor(private afs: AngularFirestore, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<UserAllData | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public setCurrentUser(user: UserAllData): void {
    this.currentUserSubject.next(user);
  }

  public getCurrentUser(): UserAllData | null {
    return this.currentUserSubject.value;
  }

  public getCurrentUserAllData(): Observable<UserAllData | null> {
    const user = this.currentUserSubject.value;
  
    if (user && user.id !== undefined) {
      const userIdString = user.id.toString(); 
  
      return this.afs.collection<UserAllData>('users').doc(userIdString).valueChanges()
        .pipe(
          map(data => data ? data : null), 
          catchError(() => of(null))
        );
    } else {
      return of(null); 
    }
  }
  
  public updateAmountDeposited(amount: number): Observable<UserAllData> {
    return this.getCurrentUserAllData().pipe(
      mergeMap((userData) => {
        if (!userData) {
          throw new Error('O usuário não está logado.');
        }
  
        if (userData.amountDeposited === undefined) {
          throw new Error('O usuário não possui saldo definido.');
        }
  
        if (amount > userData.amountDeposited) {
          throw new Error('O valor da aposta é maior do que o saldo disponível.');
        }
  
        let updatedAmount = userData.amountDeposited - amount;
  
        if (updatedAmount == amount) updatedAmount = 0;
        
        const userIdString = userData.id.toString(); 
        return from(
          this.afs.collection('users').doc(userIdString).update({ amountDeposited: updatedAmount })
        ).pipe(
          map(() => {
            return { ...userData, amountDeposited: updatedAmount } as UserAllData;
          })
        );
      })
    );
  }
  
  public deleteUser(userId: number): Observable<any> {
    return from(this.afs.collection('users').doc(userId.toString()).delete()).pipe(
      mergeMap(() => {
        this.clearCurrentUser();
        this.router.navigate(['/login']);
        return new Observable<any>((observer) => {
          observer.next(null);
          observer.complete();
        });
      })
    );
  }

  public updateUser(userId: number, name: string, email: string): Observable<any> {
    return from(this.afs.collection('users').doc(userId.toString()).update({ name, email }));
  }

  public clearCurrentUser(): void {
    this.currentUserSubject.next(null);
  }

  public logoffUser(): void {
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
