import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnimalDraw, GetAnimalDrawResponse, PostAnimalDrawRequest, PostAnimalDrawResponse } from 'src/app/shared/types/animal.type';
import { UserBet } from 'src/app/shared/types/userBet.type';
import { UserData } from 'src/app/shared/types/userData.type';
import { UserLogged } from 'src/app/shared/types/userLogged.type';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getLoginData(): Observable<UserLogged[]> {
    return this.http.get<UserLogged[]>(`${this.baseUrl}/login`);
  }

  getAllUsersData(): Observable<UserData[]> {
    return this.http.get<UserData[]>(`${this.baseUrl}/users`);
  }

  getAllUserBets(): Observable<UserBet[]> {
    return this.http.get<UserBet[]>(`${this.baseUrl}/userBet/all`);
  }

  getAnimalDraws(draws: string): Observable<AnimalDraw[]> {
    return this.http.get<AnimalDraw[]>(`${this.baseUrl}/animals/draw/${draws}`);
  }

  getActualAnimalDraw(): Observable<GetAnimalDrawResponse> {
    return this.http.get<GetAnimalDrawResponse>(`${this.baseUrl}/animals/draw`);
  }

  postAnimalDraw(data: PostAnimalDrawRequest): Observable<PostAnimalDrawResponse> {
    return this.http.post<PostAnimalDrawResponse>(`${this.baseUrl}/animals/draw`, data);
  }
  
  putAnimalFraud(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/animals/fraud`, data);
  }
}
