import { DeploymentStatus } from './deployment-status.enum';
import { EnvironmentType } from './environment-type.enum';

export interface Application {
  id: string;
  name: string;
  description: string;
  imageId: string;
  creationDate: number;
  lastUpdateDate: number;
  tags: any[];
  metaProperties: Map<string, string>;
  userRoles: []
}

export interface ApplicationEnvironment {
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

export interface ApplicationEnvironmentDTO extends ApplicationEnvironment {
  status: DeploymentStatus;
  deployedVersion: string;
  currentVersionName: string;
}
