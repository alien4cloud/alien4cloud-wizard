import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild} from '@angular/core';
import {WizardFormStep} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.schema";
import {StepComponentDirective} from "@app/features/application-wizard/application-wizard-main/step-component.directive";
import {ApplicationWizardMainService} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.service";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/fsm/application-wizard-machine.schema";
import {WizardFromComponent} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.component";

@Component({
  selector: 'w4c-wizard-step-container',
  templateUrl: './wizard-step-container.component.html',
  styleUrls: ['./wizard-step-container.component.css']
})
export class WizardStepContainerComponent implements OnInit {

  @Input() steps: WizardFormStep[];
  @ViewChild(StepComponentDirective, {static: true}) stepComponent: StepComponentDirective;

  constructor(
    private mainService : ApplicationWizardMainService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
  }

  displayStep(step: WizardFormStep, context: ApplicationWizardMachineContext) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(step.component);

    const viewContainerRef = this.stepComponent.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<WizardFromComponent>componentRef.instance).fsmContext = context;
    (<WizardFromComponent>componentRef.instance).wizardFormStep = step;
    console.log("Component created");
  }

}
