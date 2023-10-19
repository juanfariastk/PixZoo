import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainNavbarComponent } from './main-navbar/main-navbar.component';

const navbarRoutes: Routes = [
  {path: 'dashboard',component: MainNavbarComponent,},
];

@NgModule({
  imports: [RouterModule.forChild(navbarRoutes)],
  exports: [RouterModule],
})
export class SideNavbarRoutingModule {}
