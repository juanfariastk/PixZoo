import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { RouterModule } from '@angular/router';

import { MainContentUserComponent } from './main-content-user/main-content-user.component';
import { MainContentComponent } from './main-content/main-content.component';
import { MainNavbarComponent } from './main-navbar/main-navbar.component';
import { SideNavbarRoutingModule } from './side-navbar-routing.module';

@NgModule({
  declarations: [
    MainContentComponent,
    MainNavbarComponent,
    MainContentUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    SideNavbarRoutingModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatToolbarModule,
    MatListModule, 
    MatCardModule
  ]
})
export class SideNavbarModule {}
