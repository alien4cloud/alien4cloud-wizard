import {A4cLocation, Orchestrator} from '@app/core/models';

export class EnvironmentLocation {

    location: A4cLocation;
    orchestrator: Orchestrator;
    reasons: string;
    ready: boolean;
}
