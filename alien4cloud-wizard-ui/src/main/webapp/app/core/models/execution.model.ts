export class Execution {
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
  SCHEDULED,
  RUNNING,
  SUCCEEDED,
  CANCELLED,
  FAILED
}

export enum WorkflowExecutionStepStatus {
  STARTED,
  COMPLETED_SUCCESSFULL,
  COMPLETED_WITH_ERROR
}

export class Task {
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
  SCHEDULED,
  CANCELLED,
  STARTED,
  SUCCEEDED,
  FAILED
}

export class WorkflowExecutionDTO {
  execution: Execution;
  actualKnownStepInstanceCount: number;
  lastKnownExecutingTask: Task;
  stepStatus: any;
  stepInstances: any;
  stepTasks: any;
}
