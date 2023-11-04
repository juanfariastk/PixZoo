import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animalsArray } from 'src/app/shared/animals/animalsArray';
import { AdminService } from '../admin-services/admin-service.service';

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

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  sortAnimals() {
    this.animalDraws = [];

    const draws = this.drawInput.split(',').map((number) => number.trim());

    if (draws.length > 6) {
      this.showSnackBar('Limite de 5 animais por sorteio atingido.');
    } else {
      this.adminService.getAnimalDraws(draws.join(',')).subscribe((data) => {
        if (this.animalDraws.length + data.length <= 5) {
          this.animalDraws = this.animalDraws.concat(data);
          this.createAnimalDataMap();
        } else {
          this.showSnackBar('Limite de 5 animais por sorteio atingido.');
        }
      });
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
    this.adminService.postAnimalDraw(this.animalDraws).subscribe(
      () => {
        this.showSnackBar('Sorteio definido com sucesso.');
        this.updateActualDrawData(); 
      },
      (error) => {
        if (error.status === 429) {
          this.showSnackBar('Sorteio já foi definido, aguarde 24h para definir um novo sorteio! ');
        } else {
          this.showSnackBar('Erro: ' + error.message);
        }
      }
    );
  }

  updateActualDrawData() {
    this.adminService.getActualAnimalDraw().subscribe((data) => {
      if (data && data.actualDraw && data.actualDraw.length > 0) {
        this.actualDrawData = data.actualDraw;
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
    this.adminService.getActualAnimalDraw().subscribe((data) => {
      if (data && data.actualDraw && data.actualDraw.length > 0) {
        this.actualDrawData = data.actualDraw;
        console.log(this.actualDrawData)
        this.showCurrentDraw = true;
      } else {
        this.showCurrentDraw = false;
      }
    });
  }   
}
