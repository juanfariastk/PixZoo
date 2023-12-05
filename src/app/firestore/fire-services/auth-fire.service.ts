import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserRegister } from 'src/app/shared/types/register.type';
import { UserAllData } from 'src/app/shared/types/userAllData.type';
import { UserLogged } from 'src/app/shared/types/userLogged.type';
import { UserLogin } from '../../shared/types/login.type';
import { UserFireService } from './user-fire.service';

@Injectable({
  providedIn: 'root'
})
export class AuthFireService {

  collectionUserLogin!: AngularFirestoreCollection<UserLogged>;
  COLLECTION_NAME = 'login';

  constructor(
    private userService: UserFireService,
    private router: Router,
    private afs: AngularFirestore
  ) {
    this.collectionUserLogin = this.afs.collection<UserLogged>(this.COLLECTION_NAME);
  }

  register(userData: UserRegister): Observable<any> {
    return new Observable(observer => {
      delete userData.id; 
      this.afs.collection('users', ref => ref.orderBy('userId', 'desc').limit(1)).get()
        .subscribe(snapshot => {
          let lastId = 0;
          if (!snapshot.empty) {
            const lastUser = snapshot.docs[0].data() as UserRegister;
            lastId = lastUser.userId || 0;
          }
  
          const newUser: UserRegister = { ...userData, userId: lastId + 1 };
  
          this.afs.collection('users').add(newUser)
            .then((response) => {
              observer.next(response);
              observer.complete();
            })
            .catch(error => {
              observer.error(error);
              observer.complete();
            });
        });
    }).pipe(
      catchError(error => {
        console.error('Erro no registro:', error);
        return throwError('Erro no registro: ' + error);
      })
    );
  }
  

  login(credentials: UserLogin) {
    return new Observable(observer => {
      this.userService.getAllUsers().subscribe((users: UserAllData[] | null) => {
        if (users) {
          const matchedUser = users.find(user =>
            user.email === credentials.email && user.password === credentials.password
          );

          if (matchedUser) {
            const userLogged: UserLogged = {
              userId: matchedUser.userId,
              userEmail: matchedUser.email,
              openedAt: new Date().toISOString(),
              userType: matchedUser.CPF ? 'customer' : matchedUser.CNPJ ? 'administrator' : 'unknown'
            };
            this.afs.collection('login').add(userLogged)
              .then((response) => {observer.next(response); observer.complete()})
              
            this.collectionUserLogin.doc(matchedUser.id.toString()).set(userLogged)
              .then(() => {
                this.userService.setCurrentUser(matchedUser);
                if (matchedUser.CPF) {
                  this.router.navigate(['/dashboard']);
                } else if (matchedUser.CNPJ) {
                  this.router.navigate(['/admin/all']);
                }
                observer.next('Login successful');
                observer.complete();
              })
              .catch(error => {
                observer.error('Erro ao adicionar/atualizar dados do usuário: ' + error.message);
                observer.complete();
              });
          } else {
            observer.error('Credenciais inválidas.');
            observer.complete();
          }
        } else {
          observer.error('Erro ao buscar usuários.');
          observer.complete();
        }
      });
    }).pipe(
      catchError(error => {
        console.error('Erro no login:', error);
        return throwError('Erro no login: ' + error);
      })
    );
  }
}
