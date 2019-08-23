import {
  PropertyDefinition,
} from '@app/core/models';

export interface Workflow {
  name: string;
  /** Description of the workflow. */
  description: string;
  /** Additional metadata for the workflow. */
  metadata: Map<string, string>;
  /** Inputs of the workflow. */
  inputs: Map<string, PropertyDefinition>;
  /** List of preconditions that must be valid so the workflow or sub-workflow is executed. */
  // preconditions: PreconditionDefinition[];
  /** Initial steps of the workflow. */
  steps: Map<string, WorkflowStep>;
  /** We check this flag to decide if we should serialize this workflow in the YAML */
  hasCustomModifications: boolean;
  isStandard: boolean;
}

export interface WorkflowStep {
  /** The target of the step (this can be a node template name, a group name). */
  target: string;
  /** The target host of the step. SOURCE or TARGET for a relationship. */
  operationHost: string;
  /** Filter definition for optional steps. */
  // filter: AbstractConditionClause[];
  /** The list of activities to call in a sequence as part of that workflow step. */
  // activities: AbstractWorkflowActivity[];
  /** The steps to trigger (in parallel if multiple) if the workflow step has been executed correctly. */
  onSuccess: Set<string>;
  /** The steps to trigger (in parallel if multiple) if the workflow step has failed. */
  onFailure: Set<string>;
  /** The id / name of the step in the workflow **/
  name: string;
  /** The steps that precedes immediately this step in the workflow sequence **/
  precedingSteps: Set<string>;
}

export interface NodeWorkflowStep extends WorkflowStep {
  /** The node id of the host where the step will be executed **/
  hostId: string;
}

export interface RelationshipWorkflowStep extends WorkflowStep {
  /**
   * The optional name of a requirement of the target in case the step refers to a relationship rather than a node or group. Note that this is applicable only
   * if the target is a node.
   */
  targetRelationship: string;
  /** The node id of the host of the source of the relationship **/
  sourceHostId: string;
  /** The node id of the host of the target of the relationship **/
  targetHostId: string;
}

export interface SimpleStep extends WorkflowStep {
}
