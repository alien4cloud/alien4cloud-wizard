import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from '@angular/flex-layout';
import {A4cMaterialModule} from '@app/shared';
import { CreateApplicationRoutingModule } from './application-create-routing.module';
import { ApplicationCreateComponent } from './application-create/application-create.component';
import { TopologyTemplateComponent } from './topology-template/topology-template.component';
import { ApplicationDescriptionComponent } from './application-description/application-description.component';



@NgModule({
  declarations: [ApplicationCreateComponent, TopologyTemplateComponent, ApplicationDescriptionComponent],
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
