import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { concatMap, switchMap, throwError } from 'rxjs';
import { AdminFireService } from 'src/app/firestore/fire-services/admin-fire.service';
import { animalsArray } from 'src/app/shared/animals/animalsArray';

@Component({
  selector: 'app-draw-dialog',
  templateUrl: './draw-dialog.component.html',
  styleUrls: ['./draw-dialog.component.scss']
})
export class DrawDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DrawDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any, private adminService: AdminFireService) { }

  definedAnimals = this.data.definedAnimals;
  allAnimals = this.data.allAnimals;
  selectedDefinedAnimal: string | null = null;
  selectedNewAnimal: string | null = null;
  processing = false;

  onDefinedAnimalSelectionChange(event: any): void {
    this.selectedDefinedAnimal = event.value;
  }

  onNewAnimalSelectionChange(event: any): void {
    this.selectedNewAnimal = event.value;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  commitFraud(): void {
    if (!this.processing && this.selectedDefinedAnimal && this.selectedNewAnimal) {
      this.processing = true; 

      this.adminService.getActualAnimalDraw().subscribe(
        (animals: any[]) => {
          const updatedAnimals = this.updateAnimalFraud(animals);
          //console.log('Animais atualizados:', updatedAnimals);
          this.executePutFraud(updatedAnimals);
        },
        (error: any) => {
          console.error('Erro ao buscar animais:', error);
          this.dialogRef.close();
          this.processing = false; 
        }
      );
    } else {
      console.error('Ação não concluída.');
    }
  }
  
  updateAnimalFraud(animals: any[]): any[] {
    const updatedAnimals = animals.map(animal => {
      const updatedAnimal: any = {};
  
      for (const animalDraw of animal.actualDraw) {
        const animalKey = Object.keys(animalDraw)[0]; 
        if (animalKey === this.selectedDefinedAnimal) {
          //console.log(this.selectedNewAnimal)
          const newAnimalKey = `${this.selectedNewAnimal}`;
          const newValues = animalsArray.map((animal:any) => animal.name === this.selectedNewAnimal ?animal.value.toString().split(',') : null).filter((animal:any) => animal !== null)[0];
          //console.log(newValues)
          updatedAnimal[newAnimalKey] = newValues;
        } else {
          updatedAnimal[animalKey] = animalDraw[animalKey];
        }
      }
  
      return updatedAnimal;
    });
  
    //('Animais atualizados:', updatedAnimals);
    return updatedAnimals;
  }
  
  
  executePutFraud(updatedAnimals: any[]): void {
    this.adminService.putAnimalFraud(updatedAnimals).subscribe(
      () => {
        console.log('Operações concluídas.');
        this.dialogRef.close();
        this.processing = false;
      },
      (error) => {
        console.error('Erro ao realizar operações:', error);
        this.dialogRef.close();
        this.processing = false;
      }
    );
  }  
  
  
  revertDeleteAndClose(docID: string, updatedAnimals: any[]): void {
    if (docID) {
      this.adminService.postAnimalDraw(updatedAnimals).subscribe(
        () => {
          console.log('Exclusão revertida.');
          this.dialogRef.close();
          this.processing = false;
        },
        (error) => {
          console.error('Erro ao reverter a exclusão:', error);
          this.dialogRef.close();
          this.processing = false;
        }
      );
    }
  }
  
  
  
}
