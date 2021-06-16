import {HasProperties, HasTags} from "@app/core/models";
import {
  AbstractPropertyValue, IValue,
  PropertyDefinition
} from "@alien4cloud/wizard4cloud-commons";

export interface AbstractToscaType extends HasTags {
  archiveName: string;
  archiveVersion: string;
  elementId: string;
  description: string;
}

export interface HasPropertyDefinitions {
  properties: Map<string, PropertyDefinition>;
}

export interface AbstractInheritableToscaType extends AbstractToscaType, HasPropertyDefinitions {
  isAbstract: boolean;
  derivedFrom: string[];
}

export interface AbstractInstantiableToscaType extends AbstractInheritableToscaType {
}

export interface PolicyType extends AbstractInheritableToscaType {
  //private Set<String> targets;
  //private Map<String, PolicyTrigger> triggers;
}

export interface NodeType extends AbstractInstantiableToscaType {
  capabilities : CapabilityDefinition[];
  requirements: RequirementDefinition[];
  defaultCapabilities : string[];
  alienScore : number;
  /** When the type is created from a topology template (substitution), contains the topology id. */
  substitutionTopologyId :string ;
  /** Portability information. */
  portability : Map<String, AbstractPropertyValue> ;
  metaProperties : Map<String, String> ;
}

export interface AbstractTemplate extends HasTags, HasProperties {
  name: string;
  type: string;
  description: string;
}

export interface AbstractInstantiableTemplate extends AbstractTemplate {
  attributes: Map<string, IValue>;
  // artifacts: Map<string, DeploymentArtifact>;
  // interfaces: Map<string, Interface>;
}

export interface NodeTemplate extends AbstractInstantiableTemplate {
  // requirements: Map<string, Requirement>;
  relationships: Map<string, RelationshipTemplate>;
  // capabilities: Map<string, Capability>;
  isDanglingRequirement: boolean;
  nodeFilter: NodeFilter;
  groups: string[];
  portability: Map<string, AbstractPropertyValue>;
}

export interface PolicyTemplate extends AbstractTemplate {
  targets: string[];
  // triggers: Map<string, PolicyTrigger>;
}

export interface RelationshipTemplate extends AbstractInstantiableTemplate {
  target: string;
  requirementName: string;
  requirementType: string;
  targetedCapabilityName: string;
}

export interface CapabilityDefinition {
}

export interface RequirementDefinition {
}
