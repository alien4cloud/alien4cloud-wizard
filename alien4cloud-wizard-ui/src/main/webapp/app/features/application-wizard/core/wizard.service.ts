import {Injectable} from '@angular/core';
import {WelcomeComponent} from "@app/features/application-wizard/wizard-forms/welcome/welcome.component";
import {TemplateSelectionComponent} from "@app/features/application-wizard/wizard-forms/template-selection/template-selection.component";
import {ApplicationCreateComponent} from "@app/features/application-wizard/wizard-forms/application-create/application-create.component";
import {LocationSelectionComponent} from "@app/features/application-wizard/wizard-forms/location-selection/location-selection.component";
import {DeploymentValidationComponent} from "@app/features/application-wizard/wizard-forms/deployment-validation/deployment-validation.component";
import {ActiveDeploymentComponent} from '../wizard-forms/active-deployment/active-deployment.component';
import {DeploymentInputsComponent} from "@app/features/application-wizard/wizard-forms/deployment-inputs/deployment-inputs.component";
import {ApplicationMetapropertiesComponent} from "@app/features/application-wizard/wizard-forms/application-metaproperties/application-metaproperties.component";
import {NodesMatchingComponent} from "@app/features/application-wizard/wizard-forms/nodes-matching/nodes-matching.component";
import {DeleteApplicationFormComponent} from "@app/features/application-wizard/wizard-forms/delete-application-form/delete-application-form.component";
import {WizardFormStep} from "@app/features/application-wizard/core/wizard.model";
import {DeploymentArtifactsComponent} from "@app/features/application-wizard/wizard-forms/deployment-artifacts/deployment-artifacts.component";
/**
 * This is the configuration of our wizard. The step order is the same that this array order.
 */
export const wizardDefinition: WizardFormStep[] = [
  // This first step is not related to any FSM state.
  {component: WelcomeComponent, fsmStateName: ""},
  {component: TemplateSelectionComponent, fsmStateName: "templateSelectionForm"},
  {component: ApplicationCreateComponent, fsmStateName: "applicationCreateForm"},
  {component: ApplicationMetapropertiesComponent, fsmStateName: "applicationMetapropertiesForm"},
  {component: DeploymentInputsComponent, fsmStateName: "deploymentInputsForm"},
  {component: DeploymentArtifactsComponent, fsmStateName: "deploymentInputArtifactsForm"},
  {component: LocationSelectionComponent, fsmStateName: "locationSelectionForm"},
  {component: NodesMatchingComponent, fsmStateName: "nodeMatchingForm"},
  {component: DeploymentValidationComponent, fsmStateName: "deploymentForm"},
  {component: ActiveDeploymentComponent, fsmStateName: "activeDeploymentForm"},
  {component: DeleteApplicationFormComponent, fsmStateName: "deleteApplicationForm"}
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
