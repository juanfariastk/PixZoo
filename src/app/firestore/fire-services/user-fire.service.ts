import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, from, map, of, tap, throwError } from 'rxjs';
import { UserAllData } from 'src/app/shared/types/userAllData.type';

@Injectable({
  providedIn: 'root'
})
export class UserFireService {

  collectionUsers!: AngularFirestoreCollection<UserAllData>;
  COLLECTION_NAME = 'users';

  currentUserSubject: BehaviorSubject<UserAllData | null>;
  currentUser: Observable<UserAllData | null>;

  constructor(private afs: AngularFirestore, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<UserAllData | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.collectionUsers = afs.collection(this.COLLECTION_NAME)
    //this.logUsers()
    this.getCurrentUserAllData();
  }

  public setCurrentUser(user: UserAllData): void {
    this.currentUserSubject.next(user);
  }

  public getCurrentUser(): UserAllData | null {
    return this.currentUserSubject.value;
  }

  public getCurrentUserAllData(): Observable<UserAllData | null> {
    const user = this.currentUserSubject.value;
  
    if (user && user.userId !== undefined) {
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

  logUsers() {
    this.collectionUsers.valueChanges({ idField: 'id' }).subscribe(
      (users) => {
        console.log('Usuários:', users);
      },
      (error) => {
        console.error('Erro ao buscar usuários:', error);
      }
    );
  }

  getAllUsers(): Observable<UserAllData[]> {
    return this.collectionUsers.valueChanges({ idField: 'id' })
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar todos os usuários:', error);
          throw error;
        })
      ) as unknown as Observable<UserAllData[]>;
  }

  public updateAmountDeposited(amount: number): Observable<void> {
    const userData = this.getCurrentUser() as UserAllData;
  
    if (!userData) {
      throw new Error('O usuário não está logado.');
    }
  
    if (userData.userId === undefined) {
      throw new Error('ID do usuário não encontrado.');
    }
  
    if (userData.amountDeposited === undefined) {
      throw new Error('O usuário não possui saldo definido.');
    }
  
    if (amount > userData.amountDeposited) {
      throw new Error('O valor da aposta é maior do que o saldo disponível.');
    }
  
    const updatedAmount = userData.amountDeposited - amount;
  
    const updatedUserData: Partial<UserAllData> = {
      amountDeposited: updatedAmount
    };
  
    return this.updateUserById(userData.id, updatedUserData)
      .pipe(
        tap(() => {
          this.setCurrentUser({ ...userData, ...updatedUserData });
        }),
        catchError((error) => {
          console.error('Erro ao atualizar o saldo do usuário:', error);
          return throwError('Erro ao atualizar o saldo do usuário: ' + error);
        })
      );
  }
  
  private createUser(userData: UserAllData): Observable<any> {
    return from(this.afs.collection('users').add(userData));
  }
  
  public deleteUser(userId: string): Observable<any> {
    this.clearCurrentUser();
    this.router.navigate(['/login']);
    return from(this.afs.collection('users').doc(userId.toString()).delete()).pipe(
      catchError((error) => {
        console.error('Erro ao excluir usuário:', error);
        return throwError('Erro ao excluir usuário: ' + error);
      })
    );
  }

  public deleteUserById(userId: string): Observable<any> {
    return from(this.afs.collection('users').doc(userId.toString()).delete()).pipe(
      catchError((error) => {
        console.error('Erro ao excluir usuário:', error);
        return throwError('Erro ao excluir usuário: ' + error);
      })
    );
  }
  
  /*
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
  */
 
  public updateUser(userId: string, name: string, email: string): Observable<any> {
      return from(this.afs.collection('users').doc(userId.toString()).update({ name, email }));
  }

  public updateUserById(userId: string, updatedUserData: Partial<UserAllData>): Observable<void> {
    return from(this.afs.collection('users').doc(userId).update(updatedUserData))
      .pipe(
        tap(() => {
          this.setCurrentUser({ ...this.getCurrentUser(), ...updatedUserData } as UserAllData);
        }),
        catchError((error) => {
          console.error('Erro ao atualizar usuário:', error);
          return throwError('Erro ao atualizar usuário: ' + error);
        })
      );
  }
  
  
  

  public clearCurrentUser(): void {
    this.currentUserSubject.next(null);
  }

  public logoffUser(): void {
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
