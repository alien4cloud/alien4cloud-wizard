import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from "@app/shared";
import {ApplicationWizardMainComponent} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.component";
import {TemplateSelectionComponent} from "@app/features/application-wizard/step-forms/template-selection/template-selection.component";
import {ApplicationCreateComponent} from "@app/features/application-wizard/step-forms/application-create/application-create.component";
import {StepComponentDirective} from "@app/features/application-wizard/application-wizard-main/step-component.directive";
import {WizardStepContainerComponent} from "@app/features/application-wizard/wizard-step-container/wizard-step-container.component";
import {WelcomeComponent} from "@app/features/application-wizard/step-forms/welcome/welcome.component";
import {ApplicationWizardRoutingModule} from "@app/features/application-wizard/application-wizard-routing.module";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/fsm/application-wizard-machine.service";
import { TargetSelectionComponent } from './step-forms/target-selection/target-selection.component';

@NgModule({
  declarations: [
    ApplicationWizardMainComponent,
    TemplateSelectionComponent,
    ApplicationCreateComponent,
    StepComponentDirective,
    WizardStepContainerComponent,
    WelcomeComponent,
    TargetSelectionComponent
  ],
  imports: [
    SharedModule,
    ApplicationWizardRoutingModule
  ],
  providers: [AppplicationWizardMachineService],
  entryComponents: [
    WelcomeComponent,
    TemplateSelectionComponent,
    ApplicationCreateComponent,
    TargetSelectionComponent]
})
export class ApplicationWizardModule {
}
