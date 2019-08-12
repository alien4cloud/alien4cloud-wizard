export interface Deployment {
  id:string;
}

export interface MonitoredDeploymentDTO {
  deployment: Deployment;
  workflowExpectedStepInstanceCount: Map<string, number>;
}
