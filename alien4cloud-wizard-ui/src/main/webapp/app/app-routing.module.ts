import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationsService } from './layouts/applications/applications.service';
import { ApplicationsComponent } from './layouts/applications/applications.component';
import { ModulesComponent } from './layouts/modules/modules.component';
import { ImportsComponent } from './layouts/imports/imports.component';
//const routes: Routes = [];

const routes: Routes = [
  { path: '', redirectTo: '/applications', pathMatch: 'full' },
  { path: 'applications', component:  ApplicationsComponent},
  { path: 'imports', component:  ImportsComponent},
  { path: 'modules', component: ModulesComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ApplicationsComponent,ImportsComponent,ModulesComponent] ;
