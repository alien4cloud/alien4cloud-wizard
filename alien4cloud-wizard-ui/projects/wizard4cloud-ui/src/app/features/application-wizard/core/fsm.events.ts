/**
 * The event types our FSM will manage to trigger transition between states.
 */
import {
  ApplicationEnvironment,
  ApplicationEnvironmentDTO,
  Deployment,
  DeploymentStatus, Location,
  LocationMatch,
  Topology
} from "@app/core/models";
import {DeploymentTopologyDTO} from '@app/core/models/deployment-topology.model';
import {EventObject} from "xstate";

export type ApplicationWizardMachineEvents =
  Init |
  OnFormCompleted |
  InitApplicationEnvironment |
  OnActiveDeploymentFound |
  DoSelectTemplate |
  GoBack |
  DoCreateApplication |
  DoUpdateApplication |
  OnEnvironmentsFetched |
  DoSelectEnvironment |
  OnDeploymentTopologyFetched |
  OnApplicationCreateError |
  OnApplicationCreateSucess |
  OnApplicationUpdateError |
  OnApplicationUpdateSuccess |
  DoSelectLocation |
  OnSelectLocationSuccesss |
  OnLocationFetched|
  OnMatchingCompleted |
  DoSubmitDeployment|
  OnDeploymentSubmitSuccess |
  DoSubmitUndeployment|
  OnUndeploymentSubmitSuccess |
  OnUndeploymentSubmitError |
  OnDeploymentSubmitError |
  DoCancelWizard |
  DoDeleteApplication |
  OnApplicationDeleteSuccess |
  OnApplicationDeleteError
;

export class Init {
  readonly type = 'INIT';
}

export class OnFormCompleted {
  readonly type = 'OnFormCompleted';
  constructor() {}
}

export class InitApplicationEnvironment {
  readonly type = 'InitApplicationEnvironment';
  constructor(public applicationId: string , public environmentId: string) {}
}

export class OnActiveDeploymentFound {
  readonly type = 'OnActiveDeploymentFound';
  constructor(public deployment: Deployment, public deploymentStatus: DeploymentStatus) {}
}

export class DoSelectTemplate {
  readonly type = 'DoSelectTemplate';
  constructor(public topology: Topology) {}
}

export class DoCreateApplication {
  readonly type = 'DoCreateApplication';
  constructor(public applicationName: string, public applicationDescription: string, public archiveName: string) {}
}

export class DoUpdateApplication {
  readonly type = 'DoUpdateApplication';
  constructor(public applicationId: string, public applicationName: string, public applicationDescription: string) {}
}

export class OnEnvironmentsFetched {
  readonly type = 'OnEnvironmentsFetched';
  constructor(public environments: ApplicationEnvironmentDTO[]) {}
}

export class DoSelectEnvironment {
  readonly type = 'DoSelectEnvironment';
  constructor(public environment: ApplicationEnvironmentDTO) {}
}

export class DoSearchLocation {
  readonly type = 'DoSearchLocation';
  constructor(public deploymentTopology: DeploymentTopologyDTO) {}
}

export class OnDeploymentTopologyFetched {
  readonly type = 'OnDeploymentTopologyFetched';
  constructor() {}
}

export class DoSelectLocation {
  readonly type = 'DoSelectLocation';
  constructor(public location: Location) {}
}

export class OnSelectLocationSuccesss {
  readonly type = 'OnSelectLocationSucesss';
  constructor(public deploymentTopologyDTO: DeploymentTopologyDTO) {}
}

export class OnMatchingCompleted {
  readonly type = 'OnMatchingCompleted';
  constructor(public deploymentTopologyDTO: DeploymentTopologyDTO) {}
}

export class OnLocationFetched {
  readonly type = 'OnLocationFetched';
  constructor(public locations: LocationMatch[]) {}
}

export abstract class OnError {
  abstract readonly type;
  constructor(public message: string) {}
}

export class OnApplicationCreateError extends OnError {
  readonly type = 'OnApplicationCreateError';
  constructor(public message: string) { super(message) }
}

export class OnApplicationCreateSucess {
  readonly type = 'OnApplicationCreateSucess';
  constructor(public applicationId: string) {}
}

export class OnApplicationUpdateError extends OnError {
  readonly type = 'OnApplicationUpdateError';
  constructor(public message: string) { super(message) }
}

export class OnApplicationUpdateSuccess {
  readonly type = 'OnApplicationUpdateSuccess';
  constructor() {}
}

export class DoSubmitDeployment{
  readonly type = 'DoSubmitDeployment';
  constructor() {}
}

export class OnDeploymentSubmitSuccess {
  readonly type = 'OnDeploymentSubmitSuccess';
  constructor() {}
}

export class OnDeploymentSubmitError extends OnError {
  readonly type = 'OnDeploymentSubmitError';
  constructor(public message: string) { super(message) }
}

export class DoSubmitUndeployment {
  readonly type = 'DoSubmitUndeployment';
  // TODO: use deployment topology that is returned
  constructor() {}
}

export class OnUndeploymentSubmitSuccess {
  readonly type = 'OnUndeploymentSubmitSuccess';
  constructor() {}
}

export class OnUndeploymentSubmitError extends OnError {
  readonly type = 'OnUndeploymentSubmitError';
  constructor(public message: string) { super(message) }
}

export class GoBack {
  readonly type = 'GoBack';
  constructor() {}
}

export class DoCancelWizard {
  readonly type = 'DoCancelWizard';
  constructor() {}
}

export class DoDeleteApplication {
  readonly type = 'DoDeleteApplication';
  constructor() {}
}

export class OnApplicationDeleteSuccess {
  readonly type = 'OnApplicationDeleteSuccess';
  constructor() {}
}

export class OnApplicationDeleteError extends OnError {
  readonly type = 'OnApplicationDeleteError';
  constructor(public message: string) { super(message) }
}
