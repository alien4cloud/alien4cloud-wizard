/**
 * The event types our FSM will manage to trigger transition between states.
 */
import {Environment} from "@app/core";

export type ApplicationWizardMachineEvents =
  Init |
  DoSelectTemplate |
  GoBack |
  DoCreateApplication |
  OnEnvironmentsFetched |
  DoSelectEnvironment |
  OnApplicationCreateError |
  OnApplicationCreateSucess |
  DoSelectTarget |
  OnTargetSelected 
;

export class Init {
  readonly type = 'INIT';
}
export class DoSelectTemplate {
  readonly type = 'DO_SELECT_TEMPLATE';
  constructor(public templateId: string, public templateDescription: string) {}
}

export class DoCreateApplication {
  readonly type = 'DO_CREATE_APPLICATION';
  constructor(public name: string , public description: string) {}
}

export class OnEnvironmentsFetched {
  readonly type = 'ON_ENVIRONMENTS_FETCHED';
  constructor(public environments: Environment[]) {}
}

export class DoSelectEnvironment {
  readonly type = 'DO_SELECT_ENVIRONMENT';
  constructor(public environmentId: string) {}
}

export class DoSelectTarget {
  readonly type = 'DO_SELECT_TARGET';
  constructor() {}
}

export class OnTargetSelected {
  readonly type = 'ON_TARGET_SELECTED';
  constructor(public targetId: string) {}
}

export abstract class OnError {
  abstract readonly type;
  constructor(public message: string) {}
}

export class OnApplicationCreateError extends OnError {
  readonly type = 'ON_APPLICATION_CREATE_ERROR';
  constructor(public message: string) { super(message) }
}

export class OnApplicationCreateSucess {
  readonly type = 'ON_APPLICATION_CREATE_SUCCESS';
  constructor(public applicationId: string) {}
}

export class GoBack {
  readonly type = 'GO_BACK';
  constructor() {}
}

export interface Errors {
  [key: string]: string;
}
