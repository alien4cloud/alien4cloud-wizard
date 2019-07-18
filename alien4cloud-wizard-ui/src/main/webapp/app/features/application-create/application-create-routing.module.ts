import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationCreateComponent } from './application-create/application-create.component';


const routes: Routes = [
  {
    path: '',
    component: ApplicationCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateApplicationRoutingModule { }
