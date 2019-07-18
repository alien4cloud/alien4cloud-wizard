import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { ApplicationDashboardRoutingModule } from './application-dashboard-routing.module';
import { ApplicationListComponent } from './application-list/application-list.component';

// import { NgxGraphCustomCurve } from './components/ngx-graph-custom-curve/ngx-graph-custom-curve.component';
// import { NgxGraphOrgTreeComponent } from './components/ngx-graph-org-tree/ngx-graph-org-tree.component';
// import { NgxGraphModule } from '@swimlane/ngx-graph';
// import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [ApplicationListComponent],
  imports: [
    SharedModule,
    ApplicationDashboardRoutingModule
    // NgxGraphModule,
    // NgxChartsModule
  ]
})
export class ApplicationDashboardModule { }
