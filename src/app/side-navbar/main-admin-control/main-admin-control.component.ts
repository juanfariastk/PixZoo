import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminFireService } from 'src/app/firestore/fire-services/admin-fire.service';
import { animalsArray } from 'src/app/shared/animals/animalsArray';
import { AnimalDrawControl } from 'src/app/shared/types/animal.type';

@Component({
  selector: 'app-main-admin-control',
  templateUrl: './main-admin-control.component.html',
  styleUrls: ['./main-admin-control.component.scss']
})
export class MainAdminControlComponent {
  drawInput: string = '';
  animalDraws: { key: string; value: string[] }[] = [];
  animalDataMap: { [key: string]: { name: string, url: string } } = {};

  showCurrentDraw: boolean = false;
  actualDrawData: any[] = [];

  constructor(private adminService: AdminFireService, private snackBar: MatSnackBar) {}

  sortAnimals() {
    this.animalDraws = [];
  
    const draws = parseInt(this.drawInput.trim(), 10);
  
    if (draws > 5 || draws < 1 || isNaN(draws)) {
      this.showSnackBar('Informe um número entre 1 e 5.');
    } else {
      this.adminService.getAnimalDraws(draws).subscribe(
        (data) => {
          if (this.animalDraws.length + data.length <= 5) {
            const formattedAnimals = data.map(animal => ({
              key: animal.name,
              value: animal.value.map(String)
            }));
  
            this.animalDraws = this.animalDraws.concat(formattedAnimals);
            this.createAnimalDataMap();
          } else {
            this.showSnackBar('Limite de 5 animais por sorteio atingido.');
          }
        },
        (error) => {
          this.showSnackBar(error);
        }
      );
    }
  }
  
  createAnimalDataMap() {
    this.animalDataMap = {};
    for (const animal of animalsArray) {
      this.animalDataMap[animal.name] = animal;
    }
  }

  getAnimalData(key: string) {
    if (key in this.animalDataMap) {
      return this.animalDataMap[key];
    } else {
      return { name: key, url: '' };
    }
  }

  setDraw() {
    this.adminService.getActualAnimalDraw().subscribe((data) => {
      if (data && data.length > 0 && data[0].actualDraw && data[0].actualDraw.length > 0) {
        this.showSnackBar('Sorteio já foi definido. Aguarde 24h para definir um novo sorteio!');
      } else {
        if (this.animalDraws.length === 0) {
          this.showSnackBar('Não há animais para definir.');
          return;
        }
      
        const actualDraw: { [key: string]: string[] }[] = [];
        const createdAt = new Date().toLocaleDateString('pt-BR');
        const animalsToSend = this.animalDraws.reduce((acc, animal) => {
          acc.push({ [animal.key]: animal.value });
          return acc;
        }, actualDraw);
      
        const animalDrawControl: AnimalDrawControl = {
          actualDraw: animalsToSend,
          CreatedAt: [createdAt],
        };
      
        this.adminService.postAnimalDraw(animalDrawControl).subscribe(
          () => {
            this.showSnackBar('Sorteio definido com sucesso.');
            this.updateActualDrawData(); 
          },
          (error) => {
            if (error.status === 429) {
              this.showSnackBar('Sorteio já foi definido, aguarde 24h para definir um novo sorteio! ');
            } else {
              this.showSnackBar('Erro ao definir sorteio: ' + error.message);
            }
          }
        );
      }
    });
  }
  
  updateActualDrawData() {
    this.adminService.getActualAnimalDraw().subscribe((data) => {
      //console.log(data);
      if (data && data.length > 0) {
        const actualDraw = data[0].actualDraw; 
        const formattedDraws = actualDraw.map(drawObj => ({
          key: Object.keys(drawObj)[0],
          value: Object.values(drawObj)[0]
        }));
        
        this.actualDrawData = formattedDraws;
        this.showCurrentDraw = true;
      } else {
        this.showCurrentDraw = false;
      }
    });
  }
  
  showSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
    });
  }

  isCreatedAt(draw: any): boolean {
    return draw.hasOwnProperty('CreatedAt');
  }
  
  getAnimalName(draw: any): string {
    return Object.keys(draw)[0];
  }

  getAnimalImageUrl(draw: any): string {
    //const animalKey = Object.keys(draw)[0];
    const animalName = this.getAnimalName(draw);
    const animal = animalsArray.find(animal => animal.name === animalName);
  
    return animal ? animal.url : ''; 
  }

  ngOnInit() {
    /*this.adminService.getActualAnimalDocumentId().subscribe((docId) => {
      console.log('Document ID:', docId)});
      */
    this.adminService.getActualAnimalDraw().subscribe((data) => {
      //console.log(data)
      if (data && data.length > 0 && data[0].actualDraw && data[0].actualDraw.length > 0) {
        this.actualDrawData = data[0].actualDraw;
        //console.log(this.actualDrawData)
        this.showCurrentDraw = true;
      } else {
        this.showCurrentDraw = false;
      }
    });
  }
   
}
