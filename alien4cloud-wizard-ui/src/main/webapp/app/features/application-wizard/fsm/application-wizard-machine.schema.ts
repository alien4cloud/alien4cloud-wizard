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

export interface ApplicationWizardMachineContext {
  templateId: string;
  applicationName: string;
  applicationDescription: string;
  applicationId: string;
  // user: User;
  errors: string[];
}
