import { Topology } from './topology.model';
import {AbstractPropertyValue, CSARDependency, NodeType} from "@app/core";

export interface AbstractTopologyDTO<T extends Topology> {
  topology : T ;
  nodeTypes: Map<string, NodeType>;
  // FIXME: create classes
  // relationshipTypes: Map<string, RelationshipType>;
  // capabilityTypes: Map<string, CapabilityType>;
  // dataTypes: Map<string, DataType>;
  // policyTypes: Map<string, PolicyType>;
}

export interface DeploymentTopologyDTO extends AbstractTopologyDTO<DeploymentTopology> {
  locationPolicies: Map<string, string>;
  // validation: TopologyValidationResult;
  // locationResourceTemplates: Map<string, LocationResourceTemplate>;
  // policyLocationResourceTemplates: Map<string, PolicyLocationResourceTemplate>;
  // availableSubstitutions: DeploymentSubstitutionConfiguration;
  // secretCredentialInfos: SecretCredentialInfo[];
}

export interface DeploymentTopology extends Topology {
  id: string;
  isDeployed: boolean;
  versionId: string;
  environmentId: string;
  initialTopologyId: string;
  orchestratorId: string;
  // locationGroups: Map<string, NodeGroup>;
  locationDependencies: CSARDependency[];
  lastDeploymentTopologyUpdateDate: number;
  substitutedNodes: Map<string, string>;
  // originalNodes: Map<string, NodeTemplate>;
  // matchReplacedNodes: Map<string, NodeTemplate>;
  providerDeploymentProperties: Map<string, string>;
  deployerInputProperties: Map<string, AbstractPropertyValue>;
  preconfiguredInputProperties: Map<string, AbstractPropertyValue>;
  // uploadedInputArtifacts: Map<string, DeploymentArtifact>;
  substitutedPolicies: Map<string, string>;
  // originalPolicies: Map<string, PolicyTemplate>;
}


