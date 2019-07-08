import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
//import { MatTabsModule } from '@angular/material/tabs';
//import { StatusComponent } from '../test/status/status.component';
//import { HeaderComponent } from '../layouts/header/header.component';
import {A4cMaterialModule} from '../shared/a4c-material/a4c-material.module';

@NgModule({
  declarations: [
    HomeComponent, 
   // StatusComponent,
   // HeaderComponent
  ],
  imports: [
    CommonModule,
    A4cMaterialModule    
  ]
})
export class HomeModule { }
