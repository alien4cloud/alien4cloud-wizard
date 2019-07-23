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
  /**
   * The topology template id that have been chosen.
   */
  templateId: string;
  /**
   * The deccsription of the chosen topology template.
   */
  templateDescription: string;
  applicationName: string;
  applicationDescription: string;
  /**
   * The id of the created application : if this is undefined, it means that the
   * application has not been yet created.
   */
  applicationId: string;
  errors: string[];
}
