import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopologyGraphContainerComponent } from './topology-graph-popup/topology-graph-container.component';

const routes: Routes = [{
    path: '',
    component: TopologyGraphContainerComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopologyGraphRoutingModule { }
