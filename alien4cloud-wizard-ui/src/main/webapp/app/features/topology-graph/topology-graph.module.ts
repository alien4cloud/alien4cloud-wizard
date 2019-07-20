import {NgModule} from '@angular/core';
import {NgxGraphModule} from '@swimlane/ngx-graph';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {SharedModule} from '@app/shared';

import {TopologyGraphRoutingModule} from './topology-graph-routing.module';
import {TopologyGraphViewerComponent} from '.';
import {CommonModule} from "@angular/common";

/**
 * This module should be lazy loaded since it embeds NgxGraphModule and NgxChartsModule. Do not import statically.
 * It's declared in the lazyModules section of angular.js so ng build a separate chunk for it.
 */
@NgModule({
  declarations: [TopologyGraphViewerComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxGraphModule,
    NgxChartsModule,
    TopologyGraphRoutingModule
  ],
  bootstrap: [TopologyGraphViewerComponent]
})
export class TopologyGraphModule {

  constructor() {
    console.log("================ Graph module instanciated");
  }

}
