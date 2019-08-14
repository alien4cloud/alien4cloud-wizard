import {NgModule} from '@angular/core';
import {SharedModule} from "@app/shared";
import {WizardMainComponent} from "@app/features/application-wizard/wizard-main/wizard-main.component";
import {TemplateSelectionComponent} from "@app/features/application-wizard/wizard-forms/template-selection/template-selection.component";
import {ApplicationCreateComponent} from "@app/features/application-wizard/wizard-forms/application-create/application-create.component";
import {StepComponentDirective} from "@app/features/application-wizard/wizard-step-container/step-component.directive";
import {WizardStepContainerComponent} from "@app/features/application-wizard/wizard-step-container/wizard-step-container.component";
import {WelcomeComponent} from "@app/features/application-wizard/wizard-forms/welcome/welcome.component";
import {ApplicationWizardRoutingModule} from "@app/features/application-wizard/application-wizard-routing.module";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {LocationSelectionComponent} from './wizard-forms/location-selection/location-selection.component';
import {NgxGraphModule} from "@swimlane/ngx-graph";
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {HeroLoaderModule} from "@herodevs/hero-loader";
import { ApplicationDeploymentComponent } from './wizard-forms/application-deployment/application-deployment.component';
import { ActiveDeploymentComponent } from './wizard-forms/active-deployment/active-deployment.component';
import { WizardButtonComponent } from './wizard-button/wizard-button.component';
import { WizardSpinnerComponent } from './wizard-forms/wizard-spinner/wizard-spinner.component';
import { DeploymentInputsComponent } from './wizard-forms/deployment-inputs/deployment-inputs.component';
import { ApplicationMetapropertiesComponent } from './wizard-forms/application-metaproperties/application-metaproperties.component';
import { NodesMatchingComponent } from './wizard-forms/nodes-matching/nodes-matching.component';
import { WizardControlComponent } from './wizard-control/wizard-control.component';

@NgModule({
  declarations: [
    WizardMainComponent,
    TemplateSelectionComponent,
    ApplicationCreateComponent,
    StepComponentDirective,
    WizardStepContainerComponent,
    WelcomeComponent,
    LocationSelectionComponent,
    ApplicationDeploymentComponent,
    ActiveDeploymentComponent,
    WizardButtonComponent,
    WizardSpinnerComponent,
    DeploymentInputsComponent,
    ApplicationMetapropertiesComponent,
    NodesMatchingComponent,
    WizardControlComponent
  ],
  imports: [
    SharedModule,
    ApplicationWizardRoutingModule,
    NgxGraphModule,
    NgxChartsModule,
    HeroLoaderModule
  ],
  providers: [AppplicationWizardMachineService],
  entryComponents: [
    WelcomeComponent,
    TemplateSelectionComponent,
    ApplicationCreateComponent,
    ApplicationMetapropertiesComponent,
    DeploymentInputsComponent,
    LocationSelectionComponent,
    NodesMatchingComponent,
    ApplicationDeploymentComponent,
    ActiveDeploymentComponent,
    WizardSpinnerComponent]
})

export class ApplicationWizardModule {
}
