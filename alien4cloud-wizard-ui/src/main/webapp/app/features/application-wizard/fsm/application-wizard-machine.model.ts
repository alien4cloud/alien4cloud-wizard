/**
 * Specify the schema of our state machine configuration.
 */
export interface ApplicationWizardMachineSchema {
  states: {
    boot: {};
    templateSelectionForm: {};
    templateSelected: {};
    applicationCreateForm: {};
    applicationCreating: {};
    applicationCreated: {};
    applicationCreationError: {};
    targetSelectionForm: {};
  };
}

/**
 * This context will we available in states emitted by FSM.
 * It holds all the data that our wizard will have to store.
 */
export interface ApplicationWizardMachineContext {
  templateId: string;
  applicationName: string;
  applicationDescription: string;
  applicationId: string;
  errors: string[];
}
