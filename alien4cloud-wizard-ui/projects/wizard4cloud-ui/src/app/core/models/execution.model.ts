import {WorkflowStepInstance} from "@app/core/models";

export interface Execution {
  id : string;
  deploymentId: string;
  workflowId: string;
  workflowName: string;
  displayWorkflowName: string;
  startDate: number;
  endDate: number;
  status: ExecutionStatus;
  hasFailedTasks: boolean;
}

export enum ExecutionStatus {
  SCHEDULED = "SCHEDULED",
  RUNNING = "RUNNING",
  SUCCEEDED = "SUCCEEDED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED"
}

export interface Task {
  id: string;
  deploymentId: string;
  executionId: string;
  workflowStepInstanceId: string;
  operationName: string;
  nodeId: string;
  instanceId: string;
  scheduleDate: number;
  status: TaskStatus;
  details: string;
}

export enum TaskStatus {
  SCHEDULED = "SCHEDULED",
  CANCELLED = "CANCELLED",
  STARTED = "STARTED",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED"
}

export interface WorkflowExecutionDTO {
  execution: Execution;
  actualKnownStepInstanceCount: number;
  lastKnownExecutingTask: Task;
  stepStatus: Map<string, WorkflowExecutionStepStatus>;
  stepInstances: Map<string, WorkflowStepInstance[]>;
  stepTasks: Map<string, Task[]>;
}

export class ProgessBarData {
  public workflowInProgress: boolean;
  public workflowName: string;
  public progress: number;
  public status: ExecutionStatus;
  public current: Task;
}

export enum WorkflowExecutionStepStatus {
  UNKNOWN = "UNKNOWN",
  STARTED = "STARTED",
  COMPLETED_SUCCESSFULL = "COMPLETED_SUCCESSFULL",
  COMPLETED_WITH_ERROR = "COMPLETED_WITH_ERROR"
}

export enum WorkflowStepInstanceStatus {
  STARTED = "STARTED",
  COMPLETED = "COMPLETED"
}

export interface WorkflowStepInstance {
  /** Unique id of the step instance. */
  id: string;

  /** The name if the step in the workflow. */
  stepId: string;

  deploymentId: string;

  /** The ID of the execution. **/
  executionId: string;

  /** The id of the node. **/
  nodeId: string;

  /** The id of the node instance. **/
  instanceId: string;

  /** The id of the target node (if this step is related to a relationship). **/
  targetNodeId: string;

  /** The id of the target node instance (if this step is related to a relationship). **/
  targetInstanceId: string;

  /** The name of the operation (provided by the orchestrator). **/
  operationName: string;

  /** Indicates if this step has failed tasks. */
  hasFailedTasks: boolean;

  status: WorkflowStepInstanceStatus;
}
