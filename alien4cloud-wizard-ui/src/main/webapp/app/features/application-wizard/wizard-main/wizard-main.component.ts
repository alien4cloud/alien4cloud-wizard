import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MatStepper} from "@angular/material";
import {WizardFormStep} from "@app/features/application-wizard/wizard-main/wizard-main.model";
import {WizardStepContainerComponent} from "@app/features/application-wizard/wizard-step-container/wizard-step-container.component";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {WizardService} from "@app/features/application-wizard/core/wizard.service";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import * as _ from "lodash";

/**
 * This main component knows:
 * <li>
 *     <ul>the state machine : it suscribe to it's state change events.</ul>
 *     <ul>the stepper : it suscribe to it's selected change events in order to render the ad-hoc form.</ul>
 * </li>
 */
@Component({
  selector: 'w4c-wizard-main',
  templateUrl: './wizard-main.component.html',
  styleUrls: ['./wizard-main.component.css']
})
export class WizardMainComponent implements OnInit {

  @ViewChild('applicationWizardStepper', {static: true}) stepper: MatStepper;

  @ViewChild(WizardStepContainerComponent, {static: true}) stepFormContainer: WizardStepContainerComponent;

  /**
   * The wizard form steps definition.
   */
  steps: WizardFormStep[];

  private currentFsmContext: ApplicationWizardMachineContext;

  private currentStepIndex : number;

  constructor(
    private fsm: AppplicationWizardMachineService,
    private mainService : WizardService
  ) {}

  ngOnInit() {

    console.log("WizardMainComponent.ngOnInit()");

    // get the wizard form steps definitions
    this.steps = this.mainService.getSteps();

    // let's suscribe to the stepper selection change events
    this.stepper.selectionChange.subscribe(data => {
      console.log(data);
      console.log("Current step is : " + data.selectedIndex);
      const currentWizardFormStep = this.steps[data.selectedIndex];
      // render the form this step concerns
      this.stepFormContainer.renderStepForm(currentWizardFormStep, this.currentFsmContext);
    });

    // let's suscribe to FSM state change events
    this.fsm.applicationWizardState$.subscribe(data => {
      console.log(data);
      console.log("State is now : " + data.value);


      // we store locally the current FSM context
      this.currentFsmContext = data.context;

      // if a wizard step is associated with this state, we'll find it here
      const expectedStepIndex = _.findIndex(this.steps, step => step.fsmStateName == data.value);
      if (expectedStepIndex > -1) {
        const expectedStep = this.steps[expectedStepIndex];
        console.log(expectedStep.fsmStateName + " is a form state !");
        this.stepper.steps.forEach((item, index) => {
          // the precedent step is considered as completed
          if (index === this.currentStepIndex) {
            item.completed = true;
            item.editable = false;
          }
          // the concerned step is made editable
          if (index === expectedStepIndex) {
            item.editable = true;
          }
        });
        // store the current step index
        this.currentStepIndex = expectedStepIndex;
        // trigger a selection change on the stepper
        this.stepper.selectedIndex = expectedStepIndex;
      } else {
        // nothing to do here: a state is not always a form state.
        console.log(`${data.value} is not a form state !`);
      }
    });

    // let's init the wizard
    this.currentStepIndex = 0;
    this.stepFormContainer.renderStepForm(this.steps[this.currentStepIndex], this.currentFsmContext);

  }

}
