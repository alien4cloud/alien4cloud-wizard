import {DeploymentStatus} from "@app/core";

export interface AbstractMonitorEvent {
  eventType: string;
  deploymentId: string;
  orchestratorId: string;
  date: number;
}

export interface PaaSDeploymentStatusMonitorEvent extends AbstractMonitorEvent {
  deploymentStatus: DeploymentStatus;
}
