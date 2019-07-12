import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationsComponent, ModulesComponent, ImportsComponent, CreationApplicationComponent, HeaderComponent } from '@app/layouts';


const routes: Routes = [
  { path: '', redirectTo: 'applications', pathMatch: 'full' },
  // { path: '', component:  HeaderComponent, outlet:'header'},
  {
    path: 'applications',
    children: [
      { path: '', component: ApplicationsComponent },
      { path: '', outlet: 'header', component: HeaderComponent }
    ]
  },
  { path: 'creationapplication', component: CreationApplicationComponent },
  { path: 'imports', component: ImportsComponent },
  { path: 'modules', component: ModulesComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ApplicationsComponent, ImportsComponent, ModulesComponent];
