export class Deployment {
  id:string;
}

export class MonitoredDeploymentDTO {
  deployment: Deployment;
  workflowExpectedStepInstanceCount: any;
}
