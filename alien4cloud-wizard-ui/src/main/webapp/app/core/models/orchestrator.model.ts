import { OrchestratorStatus } from './orchestrator-status.enum';

export class Orchestrator {
    id: string;
    name: string;
    pluginId: string;
    pluginBean: string;
    deploymentNamePattern: string;
    state: OrchestratorStatus ;
}
