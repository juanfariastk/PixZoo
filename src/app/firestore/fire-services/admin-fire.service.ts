import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, map } from 'rxjs';
import { animalsArray } from 'src/app/shared/animals/animalsArray';
import { Animal, AnimalDrawControl } from 'src/app/shared/types/animal.type';
import { UserBet } from 'src/app/shared/types/userBet.type';
import { UserData } from 'src/app/shared/types/userData.type';
import { UserLogged } from 'src/app/shared/types/userLogged.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminFireService {
  BASE_URL = environment.URL_API;

  constructor(private http: HttpClient, private firestore:AngularFirestore) {}

  getLoginData(): Observable<UserLogged[]> {
    return this.firestore.collection<UserLogged>('login').valueChanges();
  }

  getAllUsersData(): Observable<UserData[]> {
    return this.firestore.collection<UserData>('users').valueChanges();
  }

  getAllUserBets(): Observable<UserBet[]> {
    return this.firestore.collection<UserBet>('userBet/').valueChanges();
  }

  getAnimalDraws(draws: number): Observable<Animal[]> {
    if (draws > 5 || draws < 1) {
      return new Observable<Animal[]>((observer) => {
        observer.error('Informe um número entre 1 e 5.');
        observer.complete();
      });
    }
  
    const shuffledAnimals = this.shuffleArray(animalsArray);
    const selectedAnimals = shuffledAnimals.slice(0, draws);
  
    return new Observable<Animal[]>((observer) => {
      observer.next(selectedAnimals);
      observer.complete();
    });
  }
  
  
  shuffleArray(array: any[]): any[] {
    const shuffled = array.slice();
    let currentIndex = shuffled.length;
  
    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
    }
  
    return shuffled;
  }
  
  getActualAnimalDraw(): Observable<AnimalDrawControl[]> {
    return this.firestore.collection<AnimalDrawControl>('animals').valueChanges() as unknown as Observable<AnimalDrawControl[]>;
  }

  getActualAnimalDocumentId(): Observable<string> {
    return this.firestore.collection<AnimalDrawControl>('animals').snapshotChanges().pipe(
      map((actions) => {
        return actions[0].payload.doc.id;
      })
    );
  }
  
  postAnimalDraw(data: AnimalDrawControl): Observable<AnimalDrawControl> {
    const createdAt = new Date().toLocaleDateString('pt-BR');
    const animalDrawResponse: AnimalDrawControl = {
      actualDraw: data.actualDraw, 
      CreatedAt: [createdAt]
    };
  
    return new Observable<AnimalDrawControl>((observer) => {
      from(this.firestore.collection('animals').add({...animalDrawResponse})).pipe(
        map((docRef) => {
          return {
            ...animalDrawResponse,
            docId: docRef.id 
          };
        })
      ).subscribe(
        (data) => {
          observer.next(data);
          observer.complete();
        },
        (error) => {
          observer.error(`Erro ao adicionar animais: ${error}`);
          observer.complete();
        }
      );
    });
  }
  
  async putAnimalFraud(data: any[]): Promise<void> {
    const docId = await this.getActualAnimalDocumentId().toPromise();
    const docRef = this.firestore.collection('animals').doc(docId);
    console.log(docRef)
    return docRef.update({ actualDraw: data });
  }  

  async docIdTest(){
    const docId = await this.getActualAnimalDocumentId().toPromise();
    const docRef = this.firestore.collection('animals').doc(docId);
    console.log(docRef)
  }

  async deleteActualAnimalDraw(): Promise<void> {
    const docId = await this.getActualAnimalDocumentId().toPromise();
    const docRef = this.firestore.collection('animals').doc(docId);
    return docRef.delete();
  }

  async postNewAnimalDraw(data: AnimalDrawControl): Promise<any> {
    return this.firestore.collection('animals').add(data);
  }
  
}
