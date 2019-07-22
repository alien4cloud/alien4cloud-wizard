import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MatStepper} from "@angular/material";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/fsm/application-wizard-machine.schema";
import {WizardFormStep} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.schema";
import {WizardStepContainerComponent} from "@app/features/application-wizard/wizard-step-container/wizard-step-container.component";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/fsm/application-wizard-machine.service";
import {ApplicationWizardMainService} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.service";
import {StepComponentDirective} from "@app/features/application-wizard/application-wizard-main/step-component.directive";

export interface WizardFromComponent {
  fsmContext: ApplicationWizardMachineContext;
  wizardFormStep: WizardFormStep;
}

@Component({
  selector: 'w4c-application-wizard-main',
  templateUrl: './application-wizard-main.component.html',
  styleUrls: ['./application-wizard-main.component.css']
})
export class ApplicationWizardMainComponent implements OnInit {

  @ViewChild('applicationWizardStepper', {static: true}) stepper: MatStepper;

  steps: WizardFormStep[];
  @ViewChild(WizardStepContainerComponent, {static: true}) stepBanner: WizardStepContainerComponent;

  // @ViewChildren(StepComponentDirective) matSteps !: QueryList<StepComponentDirective>;

  private currentFsmContext: ApplicationWizardMachineContext;

  private currentStepIndex : number;

  constructor(
    private fsm: AppplicationWizardMachineService,
    private mainService : ApplicationWizardMainService
  ) {}

  ngOnInit() {

    this.steps = this.mainService.getSteps();
    this.currentStepIndex = 0;
    // this.matSteps.changes.subscribe((r) => { console.log("MatStep change : " + r); });

    this.stepper.selectionChange.subscribe(data => {
      console.log(data);
      console.log("Current step is : " + data.selectedIndex);
      const currentWizardFormStep = this.steps[data.selectedIndex];
      this.stepBanner.displayStep(currentWizardFormStep, this.currentFsmContext);
      // this.displayStep(currentWizardFormStep);
    });

    this.fsm.applicationWizardState$.subscribe(data => {
      console.log(data);
      console.log("State is now : " + data.value);
      const expectedStep = this.steps.filter(step => step.fsmStateName == data.value)[0];
      if (expectedStep) {
        console.log(expectedStep.fsmStateName + " is a form state !");
        this.currentFsmContext = data.context;
        this.stepper.steps.forEach((item, index) => {
          if (index === this.currentStepIndex) {
            item.completed = true;
            item.editable = false;
          }
          if (index === expectedStep.index) {
            item.editable = true;
          }
        });
        this.stepper.selectedIndex = expectedStep.index;
        this.currentStepIndex = expectedStep.index;
        // this.stepBanner.displayStep(expectedStep);
      } else {
        console.log("Not a form state !");
      }
    });
    this.stepBanner.displayStep(this.steps[0], this.currentFsmContext);

  }

}
