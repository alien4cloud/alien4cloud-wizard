import {Injectable} from '@angular/core';
import {WizardFormStep} from "@app/features/application-wizard/wizard-main/wizard-main.model";
import {WelcomeComponent} from "@app/features/application-wizard/wizard-forms/welcome/welcome.component";
import {TemplateSelectionComponent} from "@app/features/application-wizard/wizard-forms/template-selection/template-selection.component";
import {ApplicationCreateComponent} from "@app/features/application-wizard/wizard-forms/application-create/application-create.component";
import {LocationSelectionComponent} from "@app/features/application-wizard/wizard-forms/location-selection/location-selection.component";
import {ApplicationDeploymentComponent} from "@app/features/application-wizard/wizard-forms/application-deployment/application-deployment.component";
import { ActiveDeploymentComponent } from '../wizard-forms/active-deployment/active-deployment.component';
import {DeploymentInputsComponent} from "@app/features/application-wizard/wizard-forms/deployment-inputs/deployment-inputs.component";
import {ApplicationMetapropertiesComponent} from "@app/features/application-wizard/wizard-forms/application-metaproperties/application-metaproperties.component";
import {NodesMatchingComponent} from "@app/features/application-wizard/wizard-forms/nodes-matching/nodes-matching.component";
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
  {stepLabel: "Fill Inputs", component: DeploymentInputsComponent, fsmStateName: "deploymentInputsForm"},
  {stepLabel: "Fill Metaproperties", component: ApplicationMetapropertiesComponent, fsmStateName: "applicationMetapropertiesForm"},
  {stepLabel: "Select Target", component: LocationSelectionComponent, fsmStateName: "locationSelectionForm"},
  {stepLabel: "Matching", component: NodesMatchingComponent, fsmStateName: "nodeMatchingForm"},
  {stepLabel: "Deploy app", component: ApplicationDeploymentComponent, fsmStateName: "deploymentForm"},
  {stepLabel: "Active Deployment", component: ActiveDeploymentComponent, fsmStateName: "activeDeploymentForm"}
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
