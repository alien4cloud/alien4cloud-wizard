import {
  CSARDependency,
  HasTags,
  NodeTemplate,
  PolicyTemplate,
  PropertyDefinition,
  Version,
  DeploymentArtifact, Workflow, NodeType
} from '@app/core/models';

export interface Topology extends HasTags {
  archiveName: string;
  archiveVersion: string;
  nestedVersion: Version;
  workspace: string;
  description: string;
  creationDate: number;
  lastUpdateDate: number;
  dependencies: CSARDependency[];
  nodeTemplates: Map<string, NodeTemplate>;
  unprocessedNodeTemplates: Map<string, NodeTemplate>;
  policies: Map<string, PolicyTemplate>;
  inputs: Map<string, PropertyDefinition>;
  outputProperties: Map<string, Set<string>>;
  outputCapabilityProperties: Map<string, Map<string, Set<string>>>;
  outputAttributes: Map<string, Set<string>>;
  inputArtifacts: Map<string, DeploymentArtifact>;
  // groups: Map<string, NodeGroup>;
  // substitutionMapping: SubstitutionMapping;
  workflows: Map<string, Workflow>;
  unprocessedWorkflows: Map<string, Workflow>;
  empty: boolean;
  id: string;
  metaProperties: Map<string, string>;
}

export interface AbstractTopologyDTO<T extends Topology> {
  topology : T ;
  nodeTypes: Map<string, NodeType>;
  // FIXME: create classes
  // relationshipTypes: Map<string, RelationshipType>;
  // capabilityTypes: Map<string, CapabilityType>;
  // dataTypes: Map<string, DataType>;
  // policyTypes: Map<string, PolicyType>;
}

export interface TopologyDTO extends AbstractTopologyDTO<Topology>{
  lastOperationIndex :number ;
  delegateTye : string ;
  //operations : AbstractEditorOperation[];
  //dependancyConflicts : DependancyConflictDTO[];
  //archiveContentTree : TreeNode ;
}
