import {Injectable} from '@angular/core';
import {WizardFormStep} from "@app/features/application-wizard/wizard-main/wizard-main.model";
import {WelcomeComponent} from "@app/features/application-wizard/wizard-forms/welcome/welcome.component";
import {TemplateSelectionComponent} from "@app/features/application-wizard/wizard-forms/template-selection/template-selection.component";
import {ApplicationCreateComponent} from "@app/features/application-wizard/wizard-forms/application-create/application-create.component";
import {TargetSelectionComponent} from "@app/features/application-wizard/wizard-forms/target-selection/target-selection.component";
/**
 * This is the configuration of our wizard. The step order is the same that this array order.
 *
 * TODO: labels should be i18n
 */
export const wizardDefinition: WizardFormStep[] = [
  // This first step is not related to any FSM state.
  {stepLabel: "Welcome", component: WelcomeComponent, fsmStateName: ""},
  {stepLabel: "Pick a template", component: TemplateSelectionComponent, fsmStateName: "templateSelectionForm"},
  {stepLabel: "Fill the app form", component: ApplicationCreateComponent, fsmStateName: "applicationCreateForm"},
  {stepLabel: "Select Target", component: TargetSelectionComponent, fsmStateName: "targetSelectionForm"},
  {stepLabel: "deploy app", component: ApplicationCreateComponent, fsmStateName: "deployValidationForm"}
];

@Injectable({
  providedIn: 'root'
})
export class WizardService {

  constructor() {
  }

  getSteps() {
    return wizardDefinition;
  }

}
