import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ApplicationWizardMainComponent} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.component";


const routes: Routes = [{
  path: '',
  component: ApplicationWizardMainComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationWizardRoutingModule {
}
