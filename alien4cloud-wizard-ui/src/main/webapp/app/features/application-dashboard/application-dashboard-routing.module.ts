import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationListComponent } from './application-list/application-list.component';

const routes: Routes = [{
    path: '',
    component: ApplicationListComponent
  },
  {
    // path: 'topology-graph',
    path: 'topology-graph/:topologyId/:topologyVersion',
    // outlet: 'popup',
    loadChildren: () => import('@app/features/topology-graph/topology-graph.module').then(mod => mod.TopologyGraphModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationDashboardRoutingModule { }
