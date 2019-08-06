export enum ApplicationStatus {
  DEPLOYED = "DEPLOYED" ,
  UNDEPLOYED = "UNDEPLOYED"
}

export class Application {
  id: string;
  name: string;
  description: string;
  creationDate: number;
  lastUpdateDate: number;
  tags: any[];
  metaProperties: any[];
  userRoles: []
}

export class ApplicationEnvironment {
  id: string;
  name: string;
  applicationId: string;
  topologyVersion: string;
  environmentType: string;
  currentVersionName: string;
  userRoles: {};
}
