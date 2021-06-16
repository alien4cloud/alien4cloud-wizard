import {AbstractPropertyValue} from "@alien4cloud/wizard4cloud-commons";


export interface Tag {
  name: string;
  value : string;
}

export interface HasTags {
  tags: Tag[];
}

export interface HasProperties {
  properties: Map<string, AbstractPropertyValue>;
}

export interface MetaPropertyConfiguration {
  id: string;
  name: string;
  description: string;
}

export interface MetaProperty {
  configuration: MetaPropertyConfiguration;
  value: string;
}

export interface CSARDependency {
  name: string;
  version: string;
  hash: string;
}

export interface Version {
  majorVersion: number;
  minorVersion: number;
  incrementalVersion: number;
  buildNumber: number;
  qualifier : string ;
}

export interface Suggestion {
  value: string;
  decription: string;
}

export class SuggestionContextData {
  applicationId?: string;
  topologyId?: string;
  environmentId?: string;
  nodeId?: string;
  policyId?: string;
  resourceId?: string;
  capabilityId?: string;
  relationshipId?: string;
  propertyName?: string;
}

export enum SuggestionContextType {
  TopologyEdit = "TopologyEdit",
  DeploymentInput = "DeploymentInput",
  OrchestratorResourceConfiguration = "OrchestratorResourceConfiguration",
  OrchestratorPolicyConfiguration = "OrchestratorPolicyConfiguration",
  DeploymentNodeMatching = "DeploymentNodeMatching",
  DeploymentPolicyMatching = "DeploymentPolicyMatching",
  ServiceConfiguration = "ServiceConfiguration"
}

export class SuggestionRequestContext {
  type: SuggestionContextType;
  data: SuggestionContextData = new SuggestionContextData();
}
