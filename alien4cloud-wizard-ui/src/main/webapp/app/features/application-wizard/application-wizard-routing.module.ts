import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WizardMainComponent} from "@app/features/application-wizard/wizard-main/wizard-main.component";


const routes: Routes = [{
  path: '',
  component: WizardMainComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationWizardRoutingModule {
}
