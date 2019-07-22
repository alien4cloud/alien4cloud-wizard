import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {
  WizardFormStep,
  WizardFromComponent
} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.model";
import {StepComponentDirective} from "@app/features/application-wizard/application-wizard-main/step-component.directive";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/fsm/application-wizard-machine.model";

/**
 * This component is responsible of rendering the WizardFromComponent that must be shown at a given state.
 */
@Component({
  selector: 'w4c-wizard-step-container',
  templateUrl: './wizard-step-container.component.html',
  styleUrls: ['./wizard-step-container.component.css']
})
export class WizardStepContainerComponent implements OnInit {

  @ViewChild(StepComponentDirective, {static: true}) stepComponent: StepComponentDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
  }

  renderStepForm(step: WizardFormStep, context: ApplicationWizardMachineContext) {
    // get the factory
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(step.component);

    // get the view reference
    const viewContainerRef = this.stepComponent.viewContainerRef;

    // clear the view
    viewContainerRef.clear();

    // create the form component into the view
    const componentRef = viewContainerRef.createComponent(componentFactory);

    // give the context to the form component
    (<WizardFromComponent>componentRef.instance).fsmContext = context;
  }

}
