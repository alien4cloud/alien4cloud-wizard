import {CSARDependency, Orchestrator} from "@app/core/models";

export interface Location {
  id: string;
  name: string;
  orchestratorId: string;
  infrastructureType: string;
  dependencies: CSARDependency[];
  metaProperties: {};
  creationDate: number;
  lastUpdateDate: number;
}

export interface LocationMatch {
  location: Location;
  orchestrator: Orchestrator;
  reasons: string;
  ready: boolean;
}

