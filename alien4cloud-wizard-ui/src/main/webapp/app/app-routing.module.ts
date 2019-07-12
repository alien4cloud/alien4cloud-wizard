import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationsComponent,ModulesComponent,ImportsComponent} from '@app/layouts';

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
