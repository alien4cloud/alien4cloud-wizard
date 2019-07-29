import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  ApplicationsComponent,
  ModulesComponent,
  ImportsComponent,
  CreationApplicationComponent,
  HeaderComponent
} from '@app/layouts';
import { HomeComponent } from '@app/shared';
import {LoginComponent} from "@app/shared/components";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  // { path: '', component:  HeaderComponent, outlet:'header'},
  {
    path: 'applications',
    children: [
      { path: '', component: ApplicationsComponent },
      { path: '', outlet: 'header', component: HeaderComponent }
    ]
  },
  {
    path: 'application-dashboard',
    loadChildren: () => import('./features/application-dashboard/application-dashboard.module').then(mod => mod.ApplicationDashboardModule)
  },
  {
    // path: 'topology-graph',
    path: 'topology-graph/:topologyId/:topologyVersion',
    loadChildren: () => import('./features/topology-graph/topology-graph.module').then(mod => mod.TopologyGraphModule)
  },
  {
    path: 'application-wizard',
    loadChildren: () => import('./features/application-wizard/application-wizard.module').then(mod => mod.ApplicationWizardModule)
  },
  // { path: 'topology-graph/:topologyId/:topologyVersion', component: TopologyGraphContainerComponent },
  {
    path: 'create-application',
    loadChildren: () => import('./features/application-create/application-create.module').then(mod => mod.ApplicationCreateModule)
  },
  { path: 'creationapplication', component: CreationApplicationComponent },
  { path: 'imports', component: ImportsComponent },
  { path: 'modules', component: ModulesComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes/*, { enableTracing: true } */)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ApplicationsComponent, ImportsComponent, ModulesComponent];
