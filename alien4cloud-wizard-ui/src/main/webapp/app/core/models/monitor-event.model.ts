import {DeploymentStatus} from "@app/core";

export class AbstractMonitorEvent {
  eventType: string;
  deploymentId: string;
  orchestratorId: string;
  date: number;
}

export class PaaSDeploymentStatusMonitorEvent extends AbstractMonitorEvent {
  deploymentStatus: DeploymentStatus;
}
