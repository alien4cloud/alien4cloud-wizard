import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationCreateComponent } from './application-create/application-create.component';
import { TopologyTemplateComponent } from './topology-template/topology-template.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationCreateComponent
  },
  {
    path: 'topology-template',
    component: TopologyTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateApplicationRoutingModule { }
