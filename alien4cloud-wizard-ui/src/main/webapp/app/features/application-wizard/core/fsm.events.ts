/**
 * The event types our FSM will manage to trigger transition between states.
 */
import {ApplicationEnvironment, Deployment, DeploymentStatus, LocationMatch} from "@app/core";
import { DeploymentTopologyDTO } from '@app/core/models/deployment-topology.model';

export type ApplicationWizardMachineEvents =
  Init |
  OnFormCompleted |
  InitApplicationEnvironment |
  OnActiveDeploymentFound |
  DoSelectTemplate |
  GoBack |
  DoCreateApplication |
  OnApplicationMetapropertiesNotFound |
  OnApplicationMetapropertiesFound |
  OnEnvironmentsFetched |
  DoSelectEnvironment |
  DoSearchLocation|
  OnDeploymentInputsRequired |
  OnApplicationCreateError |
  OnApplicationCreateSucess |
  DoSelectLocation |
  OnSelectLocationSucesss |
  OnLocationFetched|
  DoSubmitDeployment|
  OnDeploymentSubmitSucess |
  DoSubmitUndeployment|
  OnUndeploymentSubmitSucess |
  OnUndeploymentSubmitError |
  OnDeploymentSubmitError
;

export class Init {
  readonly type = 'INIT';
}

export class OnFormCompleted {
  readonly type = 'OnFormCompleted';
  constructor() {}
}

export class InitApplicationEnvironment {
  readonly type = 'INIT_APPLICATION_ENVIRONMENT';
  constructor(public applicationId: string , public environmentId: string) {}
}

export class OnActiveDeploymentFound {
  readonly type = 'ON_ACTIVE_DEPLOYMENT_FOUND';
  constructor(public deployment: Deployment, public deploymentStatus: DeploymentStatus) {}
}

export class DoSelectTemplate {
  readonly type = 'DO_SELECT_TEMPLATE';
  constructor(public templateId: string, public templateDescription: string) {}
}

export class DoCreateApplication {
  readonly type = 'DO_CREATE_APPLICATION';
  constructor(public name: string , public description: string) {}
}

export class OnApplicationMetapropertiesNotFound {
  readonly type = 'OnApplicationMetapropertiesNotFound';
  constructor() {}
}

export class OnApplicationMetapropertiesFound {
  readonly type = 'OnApplicationMetapropertiesFound';
  constructor() {}
}

export class OnEnvironmentsFetched {
  readonly type = 'ON_ENVIRONMENTS_FETCHED';
  constructor(public environments: ApplicationEnvironment[]) {}
}

export class DoSelectEnvironment {
  readonly type = 'DO_SELECT_ENVIRONMENT';
  constructor(public environmentId: string) {}
}

export class DoSearchLocation {
  readonly type = 'DO_SEARCH_LOCATION';
  constructor(public deploymentTopology: DeploymentTopologyDTO) {}
}

export class OnDeploymentInputsRequired {
  readonly type = 'ON_DEPLOYMENT_INPUTS_REQUIRED';
  constructor() {}
}

export class DoSelectLocation {
  readonly type = 'DO_SELECT_LOCATION';
  constructor(public locationId: string,public locationName: string,public orchestratorId: string) {}
}

export class OnSelectLocationSucesss {
  readonly type = 'ON_SELECT_LOCATION_SUCESSS';
  // TODO: use deployment topology that is returned
  constructor() {}
}

export class OnLocationFetched {
  readonly type = 'ON_LOCATION_FETCHED';
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

export class OnDeploymentSubmitSucess {
  readonly type = 'ON_DEPLOYMENT_SUBMIT_SUCCESS';
  constructor() {}
}

export class OnDeploymentSubmitError extends OnError {
  readonly type = 'ON_DEPLOYMENT_SUBMIT_ERROR';
  constructor(public message: string) { super(message) }
}

export class DoSubmitUndeployment {
  readonly type = 'DO_SUBMIT_UNDEPLOYMENT';
  // TODO: use deployment topology that is returned
  constructor() {}
}

export class OnUndeploymentSubmitSucess {
  readonly type = 'ON_UNDEPLOYMENT_SUBMIT_SUCCESS';
  constructor() {}
}

export class OnUndeploymentSubmitError extends OnError {
  readonly type = 'ON_UNDEPLOYMENT_SUBMIT_ERROR';
  constructor(public message: string) { super(message) }
}

export class GoBack {
  readonly type = 'GO_BACK';
  constructor() {}
}

export interface Errors {
  [key: string]: string;
}
