import { A4cLocation } from './a4c-location.model';
import { Orchestrator } from './orchestrator.model';

export class EnvironmentLocation {

    location: A4cLocation;
    orchestrator: Orchestrator;
    reasons: string;
    ready: boolean;
}
