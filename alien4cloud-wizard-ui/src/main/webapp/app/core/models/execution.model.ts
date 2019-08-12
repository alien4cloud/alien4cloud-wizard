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

export enum WorkflowExecutionStepStatus {
  STARTED = "STARTED",
  COMPLETED_SUCCESSFULL = "COMPLETED_SUCCESSFULL",
  COMPLETED_WITH_ERROR = "COMPLETED_WITH_ERROR"
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
  stepStatus: any;
  stepInstances: any;
  stepTasks: any;
}
