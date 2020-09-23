import {DeploymentStatus} from "@app/core/models";

export interface AbstractMonitorEvent {
  eventType: string;
  deploymentId: string;
  orchestratorId: string;
  date: number;
}

export interface PaaSDeploymentStatusMonitorEvent extends AbstractMonitorEvent {
  deploymentStatus: DeploymentStatus;
}

export interface AbstractPaaSWorkflowMonitorEvent extends AbstractMonitorEvent {
  workflowId: string;
  executionId: string;
}

export interface PaaSWorkflowStartedEvent extends AbstractPaaSWorkflowMonitorEvent {
  workflowName: string;
}
