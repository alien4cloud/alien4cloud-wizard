import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { SharedModule } from '@app/shared';

import { TopologyGraphRoutingModule } from './topology-graph-routing.module';

import { TopologyGraphPopupComponent } from './topology-graph-popup/topology-graph-popup.component';
import { TopologyGraphContainerComponent } from './topology-graph-popup/topology-graph-container.component';

@NgModule({
  declarations: [TopologyGraphPopupComponent, TopologyGraphContainerComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxGraphModule,
    NgxChartsModule,
    TopologyGraphRoutingModule
  ],
  entryComponents: [
    TopologyGraphPopupComponent
  ]
})
export class TopologyGraphModule { }
