
export enum OrchestratorState {
  DISABLED,
  CONNECTING,
  CONNECTED,
  DISCONNECTED
}

export class Orchestrator {
    id: string;
    name: string;
    pluginId: string;
    pluginBean: string;
    deploymentNamePattern: string;
    state: OrchestratorState ;
}
