export class Init {
  readonly type = 'INIT';
}
export class DoSelectTemplate {
  readonly type = 'DO_SELECT_TEMPLATE';
  constructor(public templateId: string) {}
}

export class DoCreateApplication {
  readonly type = 'DO_CREATE_APPLICATION';
  constructor(public name: string , public description: string) {}
}
export class OnApplicationCreateError {
  readonly type = 'ON_APPLICATION_CREATE_ERROR';
  constructor(public errors: Errors) {}
}

export class OnApplicationCreateSucess {
  readonly type = 'ON_APPLICATION_CREATE_SUCCESS';
  constructor(public applicationId: string) {}
}

export type ApplicationWizardMachineEvents = Init | DoSelectTemplate | DoCreateApplication | OnApplicationCreateError | OnApplicationCreateSucess;

export interface Errors {
  [key: string]: string;
}
