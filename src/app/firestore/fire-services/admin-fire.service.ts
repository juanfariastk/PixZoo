import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, catchError, from, map, switchMap, tap, throwError } from 'rxjs';
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

  constructor(private firestore:AngularFirestore) {}

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

  getCurrentDraw(docId: string): Observable<AnimalDrawControl> {
    return this.firestore.collection<AnimalDrawControl>('animals').doc(docId).get().pipe(
      map((document) => {
        const actualDoc = { id: docId, ...document.data() } as AnimalDrawControl;
        return actualDoc;
      })
    );
  }

  getActualAnimalDocumentId(): Observable<string | undefined> {
    return this.firestore.collection<AnimalDrawControl>('animals').snapshotChanges().pipe(
      map((actions) => {
        if (actions.length > 0 && actions[0].payload && actions[0].payload.doc) {
          return actions[0].payload.doc.id;
        } else {
          console.error('Documento não encontrado.');
          return undefined;
        }
      }),
      catchError((error) => {
        console.error('Erro ao obter ID do documento:', error);
        return throwError(error);
      })
    );
  }
  
  
  postAnimalDraw(data: any): Observable<AnimalDrawControl> {
    //console.log(data)
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
  
  putAnimalFraud(data: any[]): Observable<any> {
    return this.getActualAnimalDocumentId().pipe(
      switchMap((docID):any => {
        if (!docID) {
          return throwError('ID do documento não encontrado.');
        }
  
        /*return this.getCurrentDraw(docID).pipe(
          switchMap(() => {
            return this.deleteAnimalDocument(docID).pipe(
              switchMap(() => {
                return this.postAnimalDraw({ atualDraw: data });
              })
            );
          })
        )*/;
      })
      
    );
  }  
  
  
   deleteAndPostAnimalDraw(docID: string, data: any[]): Observable<any> {
    return this.deleteAnimalDocument(docID).pipe(
      switchMap(() => {
        return this.postAnimalDraw(data);
      }),
      catchError((error) => {
        console.error('Erro ao excluir documento:', error);
        return throwError(error);
      })
    );
  }
  
  
  
  deleteAnimalDocument(docId: string): Observable<void> {
    return from(this.firestore.collection('animals').doc(docId).delete()).pipe(
      map(() => {
        console.log('Documento excluído com sucesso!');
      }),
      catchError(error => {
        console.error('Erro ao excluir documento:', error);
        return throwError(error);
      })
    );
  }

  
}
