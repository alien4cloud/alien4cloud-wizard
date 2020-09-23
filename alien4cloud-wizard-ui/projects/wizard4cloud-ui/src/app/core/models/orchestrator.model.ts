export enum OrchestratorState {
  DISABLED,
  CONNECTING,
  CONNECTED,
  DISCONNECTED
}

export interface Orchestrator {
  id: string;
  name: string;
  pluginId: string;
  pluginBean: string;
  deploymentNamePattern: string;
  state: OrchestratorState;
}
