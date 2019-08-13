import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { ApplicationDashboardRoutingModule } from './application-dashboard-routing.module';
import { ApplicationListComponent } from './application-list/application-list.component';
import { DeploymentStatusPiechartComponent } from './deployment-status-piechart/deployment-status-piechart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [ApplicationListComponent, DeploymentStatusPiechartComponent],
  imports: [
    SharedModule,
    ApplicationDashboardRoutingModule,
    NgxChartsModule
  ]
})
export class ApplicationDashboardModule { }
