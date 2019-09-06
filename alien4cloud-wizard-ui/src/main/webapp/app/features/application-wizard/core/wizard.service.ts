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
 *
 * TODO: labels should be i18n
 */
export const wizardDefinition: WizardFormStep[] = [
  // This first step is not related to any FSM state.
  {id: "", stepLabel: "Welcome", component: WelcomeComponent, fsmStateName: "", description: ""},
  {id: "", stepLabel: "Pick a template", component: TemplateSelectionComponent, fsmStateName: "templateSelectionForm", description: "The template will be used to create the application."},
  {id: "", stepLabel: "Fill application details", component: ApplicationCreateComponent, fsmStateName: "applicationCreateForm", description: "At least the application name is required to create an application."},
  {id: "", stepLabel: "Fill meta-properties", component: ApplicationMetapropertiesComponent, fsmStateName: "applicationMetapropertiesForm", description: "Meta-properties are defined by the administrator and should be required."},
  {id: "", stepLabel: "Fill inputs", component: DeploymentInputsComponent, fsmStateName: "deploymentInputsForm", description: "Inputs are properties that are set before the deployment, they can change the application behavior."},
  {id: "", stepLabel: "Artifacts", component: DeploymentArtifactsComponent, fsmStateName: "deploymentInputArtifactsForm", description: "Input artifacts are files that can be associated to deployemnts and used by some components of the deployed application."},
  {id: "", stepLabel: "Select target", component: LocationSelectionComponent, fsmStateName: "locationSelectionForm", description: "The target AKA location is where your application will be deployed."},
  {id: "", stepLabel: "Matching", component: NodesMatchingComponent, fsmStateName: "nodeMatchingForm", description: "Some abstract nodes need to be replaced by concrete implementations provided by the location."},
  {id: "", stepLabel: "Validation", component: DeploymentValidationComponent, fsmStateName: "deploymentForm", description: "Check if the application is ready to deploy and deploy it."},
  {id: "", stepLabel: "Manage deployment", component: ActiveDeploymentComponent, fsmStateName: "activeDeploymentForm", description: "Monitor the current deployment's workflow, undeploy the application when it's deployed, display logs, trigger workflow executions."},
  {id: "", stepLabel: "Exit", component: DeleteApplicationFormComponent, fsmStateName: "deleteApplicationForm", description: "Delete or leave the application."}
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
