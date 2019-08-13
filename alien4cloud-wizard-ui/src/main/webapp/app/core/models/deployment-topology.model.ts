import {Topology} from './topology.model';
import {AbstractPropertyValue, CSARDependency, NodeType} from "@app/core";
import {
  DeploymentSubstitutionConfiguration,
  LocationResourceTemplate,
  PolicyLocationResourceTemplate
} from "./location-resource-template.model";

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
  validation: TopologyValidationResult;
  locationResourceTemplates: Map<string, LocationResourceTemplate>;
  policyLocationResourceTemplates: Map<string, PolicyLocationResourceTemplate>;
  availableSubstitutions: DeploymentSubstitutionConfiguration;
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

export interface TopologyValidationResult {
  valid: boolean;
  taskList: AbstractTask[];
  warningList: AbstractTask[];
  infoList: AbstractTask[];
}

export interface AbstractTask {
  code: TaskCode;
  source: string;
}

export enum TaskCode {
  /* This code is to be used when a task is actually just there to dispatch a log message. */
  LOG,

  /** Topology validation codes */
  EMPTY,
  IMPLEMENT_RELATIONSHIP,
  SATISFY_LOWER_BOUND,
  PROPERTIES,
  SCALABLE_CAPABILITY_INVALID,
  NODE_FILTER_INVALID,
  WORKFLOW_INVALID,
  ARTIFACT_INVALID,
  DEPRECATED_NODE,

  /** Inputs codes */
  MISSING_VARIABLES,
  UNRESOLVABLE_PREDEFINED_INPUTS,
  PREDEFINED_INPUTS_CONSTRAINT_VIOLATION,
  PREDEFINED_INPUTS_TYPE_VIOLATION,
  INPUT_PROPERTY,
  INPUT_ARTIFACT_INVALID,

  /* Location policies */
  LOCATION_POLICY,
  LOCATION_UNAUTHORIZED,
  LOCATION_DISABLED,

  /* No matching node found on location for criterias */
  NO_NODE_MATCHES,
  NODE_NOT_SUBSTITUTED,
  FORBIDDEN_OPERATION,

  /** Post matching errors. */
  IMPLEMENT,
  REPLACE,

  ORCHESTRATOR_PROPERTY,

  /** Specific code for cloudify */
  CFY_MULTI_RELATIONS
}
