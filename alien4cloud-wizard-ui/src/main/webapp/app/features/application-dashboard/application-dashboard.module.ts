import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from '@angular/flex-layout';
import {A4cMaterialModule} from '@app/shared';

import { ApplicationDashboardRoutingModule } from './application-dashboard-routing.module';
import { ApplicationListComponent } from './application-list/application-list.component';


@NgModule({
  declarations: [ApplicationListComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ApplicationDashboardRoutingModule,
    A4cMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ApplicationDashboardModule { }
