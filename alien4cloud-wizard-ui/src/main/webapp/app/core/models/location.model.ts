import {CSARDependency, Orchestrator} from "@app/core";

export class Location {
  id: string;
  name: string;
  orchestratorId: string;
  infrastructureType: string;
  dependencies: CSARDependency[];
  metaProperties: {};
  creationDate: number;
  lastUpdateDate: number;
}

export class LocationMatch {
  location: Location;
  orchestrator: Orchestrator;
  reasons: string;
  ready: boolean;
}

