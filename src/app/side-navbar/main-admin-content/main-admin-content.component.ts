import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminFireService } from 'src/app/firestore/fire-services/admin-fire.service';
import { animalsArray } from 'src/app/shared/animals/animalsArray';
import { UserService } from 'src/app/users/services/user.service';
import { DrawDialogComponent } from '../draw-dialog/draw-dialog.component';

@Component({
  selector: 'app-main-admin-content',
  templateUrl: './main-admin-content.component.html',
  styleUrls: ['./main-admin-content.component.scss']
})
export class MainAdminContentComponent {
  actualDrawData: any;

  constructor(private dialog: MatDialog, private adminService: AdminFireService, private userService:UserService) { }

  openDialog(): void {
    this.adminService.getActualAnimalDraw().subscribe((data) => {
      this.actualDrawData = data;
      if (Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('actualDraw')) {
        const definedAnimals = data[0].actualDraw
          .filter((draw: any) => !draw.hasOwnProperty('CreatedAt'))
          .map((draw: any) => Object.keys(draw)[0]);
  
        const dialogRef = this.dialog.open(DrawDialogComponent, {
          width: '400px',
          data: {
            definedAnimals: definedAnimals,
            allAnimals: animalsArray
          }
        });
      } else {
        console.error('ActualDrawData is missing or not an array.');
      }
    });
  }
  

  logoff():void{
    setTimeout(() => {
      this.userService.logoffUser();
    }, 2300);
  }
}
