import {CSARDependency, HasTags, PropertyDefinition, Tag, Version} from '@app/core/models';

export interface Topology extends HasTags {
  archiveName: string;
  archiveVersion: string;
  nestedVersion: Version;
  workspace: string;
  description: string;
  creationDate: number;
  lastUpdateDate: number;
  dependencies: CSARDependency[];
  // nodeTemplates: Map<string, NodeTemplate>;
  // unprocessedNodeTemplates: Map<string, NodeTemplate>;
  // policies: Map<string, PolicyTemplate>;
  inputs: Map<string, PropertyDefinition>;
  outputProperties: Map<string, Set<string>>;
  outputCapabilityProperties: Map<string, Map<string, Set<string>>>;
  outputAttributes: Map<string, Set<string>>;
  // inputArtifacts: Map<string, DeploymentArtifact>;
  // groups: Map<string, NodeGroup>;
  // substitutionMapping: SubstitutionMapping;
  // workflows: Map<string, Workflow>;
  // unprocessedWorkflows: Map<string, Workflow>;
  empty: boolean;
  id: string;
  metaProperties: Map<string, string>;
}

