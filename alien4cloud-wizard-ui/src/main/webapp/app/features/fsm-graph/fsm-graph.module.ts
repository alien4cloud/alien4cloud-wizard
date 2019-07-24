import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FsmGraphViewerComponent} from './fsm-graph-viewer/fsm-graph-viewer.component';
import {SharedModule} from "@app/shared";
import {NgxGraphModule} from "@swimlane/ngx-graph";
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {FsmGraphRoutingModule} from "@app/features/fsm-graph/fsm-graph-routing.module";
import {TopologyGraphViewerComponent} from "@app/features/topology-graph";


@NgModule({
  declarations: [FsmGraphViewerComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxGraphModule,
    NgxChartsModule,
    FsmGraphRoutingModule
  ],
  bootstrap: [FsmGraphViewerComponent]
})
export class FsmGraphModule {
}
