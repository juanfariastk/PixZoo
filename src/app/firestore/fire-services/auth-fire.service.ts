import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { UserLogin } from '../../shared/types/login.type';
import { UserFireService } from './user-fire.service';
import { UserRegister } from 'src/app/shared/types/register.type';
import { UserAllData } from 'src/app/shared/types/userAllData.type';
import { UserLogged } from 'src/app/shared/types/userLogged.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  collectionUserLogin!: AngularFirestoreCollection<UserLogged>;
  COLLECTION_NAME = '/login';

  constructor(
    private userService: UserFireService,
    private router: Router,
    private afs: AngularFirestore
  ) {
    this.collectionUserLogin = this.afs.collection<UserLogged>(this.COLLECTION_NAME);
  }

  register(userData: UserRegister) {
    return this.afs.collection('users').add(userData); 
  }

  login(credentials: UserLogin) {
    this.userService.getCurrentUserAllData().subscribe((matchedUser: UserAllData | null) => {
      if (matchedUser) {
        const userLogged: UserLogged = {
          userId: matchedUser.id,
          userEmail: matchedUser.email,
          openedAt: new Date().toISOString(),
          userType: matchedUser.CPF ? 'customer' : matchedUser.CNPJ ? 'administrator' : 'unknown' 
        };

        this.collectionUserLogin.doc(matchedUser.id.toString()).set(userLogged)
          .then(() => {
            this.userService.setCurrentUser(matchedUser);
            if (matchedUser.CPF) {
              this.router.navigate(['/dashboard']);
            } else if (matchedUser.CNPJ) {
              this.router.navigate(['/admin/all']);
            }
          })
          .catch(error => throwError('Erro ao adicionar/atualizar dados do usuário: ' + error.message));
      } else {
        throwError('Credenciais inválidas.');
      }
    });
  }
}
