import {Component, ComponentFactoryResolver, OnInit, Type, ViewChild} from '@angular/core';
import {StepComponentDirective} from "@app/features/application-wizard/wizard-step-container/step-component.directive";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {WizardSpinnerComponent} from "@app/features/application-wizard/wizard-forms/wizard-spinner/wizard-spinner.component";
import {WizardFormComponent, WizardFormStep} from "@app/features/application-wizard/core/wizard.model";

/**
 * This component is responsible of rendering the WizardFormComponent that must be shown at a given state.
 */
@Component({
  selector: 'w4c-wizard-step-container',
  templateUrl: './wizard-step-container.component.html',
  styleUrls: ['./wizard-step-container.component.css']
})
export class WizardStepContainerComponent implements OnInit {

  @ViewChild(StepComponentDirective, {static: true}) stepComponent: StepComponentDirective;

  private wizardForm : WizardFormComponent;

  wizardFormStep: WizardFormStep;

  isDisabled : boolean = false ;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
  }

  renderSpinner() {
    this.renderForm(WizardSpinnerComponent);
  }

  renderStepForm(step: WizardFormStep, context: ApplicationWizardMachineContext) {
    this.wizardFormStep = step;
    this.renderForm(step.component);
    // give the context to the form component
    this.setContext(context);
  }

  private renderForm(component: Type<any>) {
    // get the factory
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    // get the view reference
    const viewContainerRef = this.stepComponent.viewContainerRef;
    // clear the view
    viewContainerRef.clear();
    // create the form component into the view
    const componentRef = viewContainerRef.createComponent(componentFactory);
    this.wizardForm = <WizardFormComponent>componentRef.instance;
  }

  setContext(fsmContext: ApplicationWizardMachineContext) {
    this.wizardForm.fsmContext = fsmContext;
  }

  blur() {
    this.isDisabled = true;
  }

  unblur(){
    this.isDisabled = false;
  }

}
