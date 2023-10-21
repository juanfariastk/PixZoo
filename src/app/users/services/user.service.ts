import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, mergeMap } from 'rxjs';
import {
  UserAllData
} from 'src/app/shared/types/userAllData.type';
import { UserLogged } from 'src/app/shared/types/userLogged.type';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<UserLogged | null>;
  public currentUser: Observable<UserLogged | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserLogged | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public setCurrentUser(user: UserLogged): void {
    this.currentUserSubject.next(user);
  }

  public getCurrentUser(): UserLogged | null {
    return this.currentUserSubject.value;
  }

  public getCurrentUserAllData(): Observable<UserAllData | null> {
    const user = this.currentUserSubject.value;
    if (user) {
      return this.http.get<UserAllData>(`http://localhost:3000/users/${user.userId}`);
    } else {
      return new Observable<UserAllData | null>((observer) => {
        observer.next(null);
        observer.complete();
      });
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

        if(updatedAmount == amount) updatedAmount = 0;
        console.log(updatedAmount)
        return this.http.put<UserAllData>(`http://localhost:3000/users/${userData.id}`, { amountDeposited: updatedAmount });
      })
    );
  }

  public clearCurrentUser(): void {
    this.currentUserSubject.next(null);
  }
}
