import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentUserComponent } from './main-content-user/main-content-user.component';
import { MainContentComponent } from './main-content/main-content.component';
import { MainNavbarComponent } from './main-navbar/main-navbar.component';

const navbarRoutes: Routes = [
  {
    path: 'dashboard',
    component: MainNavbarComponent,
    children: [
      { path: '', redirectTo: 'bets', pathMatch: 'full' },
      { path: 'bets', component: MainContentComponent },
      { path: 'user', component: MainContentUserComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(navbarRoutes)],
  exports: [RouterModule],
})
export class SideNavbarRoutingModule {}
