import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserLogin } from '../../shared/types/login.type';
import { UserRegister } from '../../shared/types/register.type';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  register(userData:UserRegister) {
    return this.http.post(`${this.baseUrl}/users`, userData);
  }

  login(credentials: UserLogin) {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      catchError((error: any) => {
        return throwError('Login falhou: ' + error.message);
      }),
      map((response: any) => {
        return response;
      })
    );
  }
  

  loginGet(){
    return this.http.get(`${this.baseUrl}/login`).pipe(map(response => {
      console.log('Resposta do login:', response);
      return response; 
    }))
  }
  
}
