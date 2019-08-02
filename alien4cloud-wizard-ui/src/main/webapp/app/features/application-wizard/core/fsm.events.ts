/**
 * The event types our FSM will manage to trigger transition between states.
 */
import {ApplicationEnvironment, LocationMatch} from "@app/core";
import { DeploymentTopologyDTO } from '@app/core/models/deployment-topology.model';

export type ApplicationWizardMachineEvents =
  Init |
  DoSelectTemplate |
  GoBack |
  DoCreateApplication |
  OnEnvironmentsFetched |
  DoSelectEnvironment |
  OnDeploymentTopologyFetched|
  OnApplicationCreateError |
  OnApplicationCreateSucess |
  DoSelectTarget |
  OnTargetFetched|
  DoSubmitDeployment|
  OnDeploymentSubmitSucess |
  OnDeploymentSubmitError |
  onActiveDeploymentCheck
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
  constructor(public environments: ApplicationEnvironment[]) {}
}

export class DoSelectEnvironment {
  readonly type = 'DO_SELECT_ENVIRONMENT';
  constructor(public environmentId: string) {}
}


export class OnDeploymentTopologyFetched {
  readonly type = 'ON_DEPLOYMENT_TOPOLOGY_FETCHED';
  constructor(public deploymentTopology: DeploymentTopologyDTO) {}
}


export class DoSelectTarget {
  readonly type = 'DO_SELECT_TARGET';
  constructor(public locationId: string,public locationName: string,public orchestratorId: string) {}
}

export class OnTargetFetched {
  readonly type = 'ON_TARGET_FETCHED';
  constructor(public locations: LocationMatch[]) {}
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

export class DoSubmitDeployment{
  readonly type = 'DO_SUBMIT_DEPLOYMENT';
  constructor() {}
}

export class onActiveDeploymentCheck{
  readonly type = 'ON_ACTIVE_DEPLOYMENT_CHECK';
  constructor() {}
}

export class OnDeploymentSubmitSucess {
  readonly type = 'ON_DEPLOYMENT_SUBMIT_SUCCESS';
  constructor() {}
}

export class OnDeploymentSubmitError extends OnError {
  readonly type = 'ON_DEPLOYMENT_SUBMIT_ERROR';
  constructor(public message: string) { super(message) }
}

export class GoBack {
  readonly type = 'GO_BACK';
  constructor() {}
}

export interface Errors {
  [key: string]: string;
}
