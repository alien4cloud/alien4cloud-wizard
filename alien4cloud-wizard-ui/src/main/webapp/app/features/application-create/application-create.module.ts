import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from '@angular/flex-layout';
import {A4cMaterialModule} from '@app/shared';
import { CreateApplicationRoutingModule } from './application-create-routing.module';
import { ApplicationCreateComponent } from './application-create/application-create.component';



@NgModule({
  declarations: [ApplicationCreateComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    CreateApplicationRoutingModule,
    A4cMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ApplicationCreateModule { }
