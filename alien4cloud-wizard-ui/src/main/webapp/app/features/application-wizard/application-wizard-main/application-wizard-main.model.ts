import {Type} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/fsm/application-wizard-machine.model";

/**
 * This represents a step of the wizard.
 */
export class WizardFormStep {
  constructor(
    /**
     * The index in the stepper.
     */
    public index: number,

    /**
     * What to display in the stepper label.
     */
    public stepLabel: string,
    /**
     * The component itself.
     */
    public component: Type<any>,
    /**
     * The FSM state name it relies to.
     */
    public fsmStateName: string
  ) {
  }
}

/**
 * Each form (components in step-forms folder) must implement this interface.
 */
export interface WizardFromComponent {
  fsmContext: ApplicationWizardMachineContext;
}
