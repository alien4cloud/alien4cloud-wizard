import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatStepper} from "@angular/material";
import {WizardStepContainerComponent} from "@app/features/application-wizard/wizard-step-container/wizard-step-container.component";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {WizardService} from "@app/features/application-wizard/core/wizard.service";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import * as _ from "lodash";
import {ActivatedRoute, Router} from "@angular/router";
import {GoBack, Init, InitApplicationEnvironment} from "@app/features/application-wizard/core/fsm.events";
import {WizardFormStep} from "@app/features/application-wizard/core/wizard.model";
import {SettingsService} from "@alien4cloud/wizard4cloud-commons";

/**
 * This main component knows:
 * <li>
 *     <ul>the state machine : it subscribe to it's state change events.</ul>
 *     <ul>the stepper : it subscribe to it's selected change events in order to render the ad-hoc form.</ul>
 * </li>
 */
@Component({
  selector: 'w4c-wizard-main',
  templateUrl: './wizard-main.component.html',
  styleUrls: ['./wizard-main.component.scss']
})
export class WizardMainComponent implements OnInit, OnDestroy {

  @ViewChild('applicationWizardStepper', {static: true}) stepper: MatStepper;

  @ViewChild(WizardStepContainerComponent, {static: true}) stepFormContainer: WizardStepContainerComponent;

  /**
   * The wizard form steps definition.
   */
  steps: WizardFormStep[];

  private currentFsmContext: ApplicationWizardMachineContext;

  private currentStepIndex: number;

  /**
   * Display the FSM only if the appropriate setting is enabled.
   */
  showFsmGraph: boolean = false;

  constructor(
    private fsm: AppplicationWizardMachineService,
    private mainService : WizardService,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.showFsmGraph = this.settingsService.getSetting(SettingsService.SHOW_FSM_GRAPH_SETTING) == 'true';
    let showWelcome = this.settingsService.getSetting(SettingsService.WIZARD_SHOWS_WELCOME) == 'true';

    this.fsm.start();
    // we have a timeout here in order to 1. let the view being displayed 2. let the listener bellow to be up
    // FIXME: find a better approach
    this.route.params.subscribe( params => {
      console.log("Route param: " + JSON.stringify(params));
      setTimeout(() => {
        if (params['applicationId'] && params['environmentId']) {
          console.log("Start a wizard on an existing app");
          this.fsm.send(new InitApplicationEnvironment(params['applicationId'], params['environmentId']));
        } else {
          console.log("Start a new wizard by sending and Init event");
          // if we don't send this event, the welcome panel will be displayed
          // FIXME: do we still use this welcome panel ?
          if (showWelcome) {
            this.renderStateForm(0);
          } else {
            this.fsm.send(new Init());
          }
        }
      }, 500);
    });

    // get the wizard form steps definitions
    this.steps = this.mainService.getSteps();

    // let's suscribe to the stepper selection change events
    this.stepper.selectionChange.subscribe(data => {
      console.log(data);
      console.log(`Stepper selection change index: ${data.selectedIndex}, currentStepIndex: ${this.currentStepIndex}`);
      if (data.selectedIndex != this.currentStepIndex) {
        console.log(`The step index coming from stepper change is ${data.selectedIndex} but the expected step is ${this.currentStepIndex}, do nothing !`);
        // need to deffer this in order to do this out of the callback
        setTimeout(value => {this.stepper.selectedIndex = this.currentStepIndex;}, 1);
      } else {
        this.renderStateForm(data.selectedIndex);
        this.stepper.steps.forEach((item, index) => {
          if (index != data.selectedIndex) {
            item.editable = false;
            item.interacted = false;
          }
        });
      }
    });

    // let's suscribe to FSM state change events
    this.fsm.applicationWizardState$.subscribe(data => {
      console.log(data);
      console.log("State is now : " + data.value);

      if (data.value == "theEnd") {
        // FIXME: we should find a better way to do this, maybe react on "Complete" observable ...
        this.router.navigateByUrl("/");
      }

      let backward: boolean = false;
      if (data.event.type === "GoBack") {
        backward = true;
      }
      console.log("Navigation direction : ", (backward) ? "<-" : "->");

      // we store locally the current FSM context
      this.currentFsmContext = data.context;

      // if a wizard step is associated with this state, we'll find it here
      const expectedStepIndex = _.findIndex(this.steps, step => step.fsmStateName == data.value);
      if (expectedStepIndex > -1) {
        console.log(`currentStepIndex: ${this.currentStepIndex}, expectedStepIndex : ${expectedStepIndex}`);
        const expectedStep = this.steps[expectedStepIndex];
        console.log(expectedStep.fsmStateName + " is a form state !");
        this.stepper.steps.forEach((item, index) => {
          // the precedent step (actually currentStepIndex) is considered as completed
          if (index === this.currentStepIndex) {
            item.completed = true;
          }
          // forward direction, all steps before the expected are completed
          if (!backward && index < expectedStepIndex) {
            item.completed = true;
          }
          if (backward && index > expectedStepIndex) {
            item.completed = false;
          }
          // the concerned step is made editable
          if (index === expectedStepIndex) {
            item.editable = true;
          }
        });
        if (this.currentStepIndex !== expectedStepIndex) {
          // store the current step index
          this.currentStepIndex = expectedStepIndex;
          // trigger a selection change on the stepper
          this.stepper.selectedIndex = expectedStepIndex;
        } else {
          // the step index has not changed (can occur when error is thrown)
          // we have to set the fsmContext to the current form
          this.stepFormContainer.setContext(this.currentFsmContext);
        }

        //Activate  action on Form
        this.stepFormContainer.unblur();


      } else {
        // nothing to do here: a state is not always a form state.
        console.log(`${data.value} is not a form state !`);
        //this.stepFormContainer.renderSpinner();

        //Desactivate action on Form
        this.stepFormContainer.blur();
      }
    }, () => {}, () => {
      console.log("Machine is completed");
    });

    // let's init the wizard
    // this.currentStepIndex = 0;
    // this.stepFormContainer.renderStepForm(this.steps[this.currentStepIndex], this.currentFsmContext);

    // if we have params, this means that we are entering an existing application wizard
    // if (this.appId && this.envId) {
    //   // let's init the machine with the applicationId and environmentId
    //   this.fsm.send(new InitApplicationEnvironment(this.appId, this.envId));
    // }

  }

  private renderStateForm(index: number) {
    const currentWizardFormStep = this.steps[index];
    // render the form this step concerns
    this.stepFormContainer.renderStepForm(currentWizardFormStep, this.currentFsmContext);
  }

  ngOnDestroy(): void {
    this.fsm.stop();
  }

}
