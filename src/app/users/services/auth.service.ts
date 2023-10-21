import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; // Import the Router
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserLogin } from '../../shared/types/login.type';
import { UserRegister } from '../../shared/types/register.type';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router, private userService:UserService) {}

  register(userData: UserRegister) {
    return this.http.post(`${this.baseUrl}/users`, userData);
  }

  login(credentials: UserLogin) {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      catchError((error: any) => {
        return throwError('Login falhou: ' + error.message);
      }),
      map((response: any) => {
        if (response.userType === 'customer' || response.userType === 'admin') {
          this.userService.setCurrentUser(response); 
          if (response.userType === 'customer') {
            this.router.navigate(['/dashboard']);
          } else if (response.userType === 'admin') {
            this.router.navigate(['/admin']);
          }
        }
        return response;
      })
    );
  }
}
