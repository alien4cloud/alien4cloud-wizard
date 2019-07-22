import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { ApplicationDashboardRoutingModule } from './application-dashboard-routing.module';
import { ApplicationListComponent } from './application-list/application-list.component';

@NgModule({
  declarations: [ApplicationListComponent],
  imports: [
    SharedModule,
    ApplicationDashboardRoutingModule
  ]
})
export class ApplicationDashboardModule { }
