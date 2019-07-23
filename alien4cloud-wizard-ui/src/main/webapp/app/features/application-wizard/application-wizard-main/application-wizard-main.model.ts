import {Type} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/fsm/application-wizard-machine.model";

/**
 * This represents a step of the wizard.
 */
export interface WizardFormStep {
  /**
   * What to display in the stepper label.
   */
  stepLabel: string;
  /**
   * The component itself.
   */
  component: Type<any>;
  /**
   * The FSM state name it relies to.
   */
  fsmStateName: string;
}

/**
 * Each form (components in step-forms folder) must implement this interface.
 */
export interface WizardFormComponent {
  /**
   * THe FSM is injected to the component so it can send events in order to trigger transitions.
   */
  fsmContext: ApplicationWizardMachineContext;
}
