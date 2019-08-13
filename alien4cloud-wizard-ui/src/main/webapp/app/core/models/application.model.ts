import { DeploymentStatus } from './deployment-status.enum';
import { EnvironmentType } from './environment-type.enum';

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
  description:   string ;
  applicationId: string;
  environmentType: EnvironmentType; 
  version: string;
  topologyVersion: string;
  userRoles: Map<string, Set<string>>;
  groupRoles: Map<string, Set<string>>;
}

export class ApplicationEnvironmentDTO extends ApplicationEnvironment {
  status: DeploymentStatus;
  deployedVersion: string;
  currentVersionName: string;
}
