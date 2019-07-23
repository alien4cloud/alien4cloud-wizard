import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from "@app/shared";
import {WizardMainComponent} from "@app/features/application-wizard/wizard-main/wizard-main.component";
import {TemplateSelectionComponent} from "@app/features/application-wizard/wizard-forms/template-selection/template-selection.component";
import {ApplicationCreateComponent} from "@app/features/application-wizard/wizard-forms/application-create/application-create.component";
import {StepComponentDirective} from "@app/features/application-wizard/wizard-step-container/step-component.directive";
import {WizardStepContainerComponent} from "@app/features/application-wizard/wizard-step-container/wizard-step-container.component";
import {WelcomeComponent} from "@app/features/application-wizard/wizard-forms/welcome/welcome.component";
import {ApplicationWizardRoutingModule} from "@app/features/application-wizard/application-wizard-routing.module";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import { TargetSelectionComponent } from './wizard-forms/target-selection/target-selection.component';

@NgModule({
  declarations: [
    WizardMainComponent,
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
