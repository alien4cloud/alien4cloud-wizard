import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '@app/shared';
import {LoginComponent} from "@app/shared/components";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'application-dashboard',
    loadChildren: () => import('./features/application-dashboard/application-dashboard.module').then(mod => mod.ApplicationDashboardModule)
  },
  {
    path: 'topology-graph/:topologyId/:topologyVersion',
    loadChildren: () => import('./features/topology-graph/topology-graph.module').then(mod => mod.TopologyGraphModule)
  },
  {
    path: 'application-wizard',
    loadChildren: () => import('./features/application-wizard/application-wizard.module').then(mod => mod.ApplicationWizardModule)
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes/*, { enableTracing: true } */)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [];
