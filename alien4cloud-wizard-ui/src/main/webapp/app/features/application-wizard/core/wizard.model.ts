import {Type} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";

/**
 * This represents a step of the wizard.
 */
export interface WizardFormStep {
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
export abstract class WizardFormComponent {
  /**
   * THe FSM is injected to the component so it can send events in order to trigger transitions.
   */
  fsmContext: ApplicationWizardMachineContext;

  constructor(protected fsm: AppplicationWizardMachineService) {
  }

}



