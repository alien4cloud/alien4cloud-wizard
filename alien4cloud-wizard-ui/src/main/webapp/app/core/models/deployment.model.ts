export interface Deployment {
  id:string;

  /**
   * Unique id of the deployment on the orchestration technology.
   * This is unique for deployments that have a null end date but you may have multiple completed deployments that share the same paasId.
   */
  orchestratorDeploymentId: string;

  deployerUsername: string;

  // DeploymentSourceType sourceType;

  /** Id of the orchestrator that manages the deployment. */
  orchestratorId: string;

  /** Id of the locations on which it is deployed. */
  locationIds: string[];

  /** Id of the application that has been deployed */
  sourceId: string;

  /** Name of the application. This is used as backup if application is deleted. */
  sourceName: string;

  /** Id of the environment on which this deployment has been created */
  environmentId: string;

  /** Id of the version of the topology on which this deployment has been created */
  versionId: string;

  /** Start date of the deployment */
  startDate: number;

  /** End date of the deployment. */
  endDate: number;

  /** Id of the services this deployment depends on. */
  serviceResourceIds: string[];

  /**
   * The last PaaS execution id per workflow.
   */
  workflowExecutions: Map<string, string>;
}

export interface MonitoredDeploymentDTO {
  deployment: Deployment;
  workflowExpectedStepInstanceCount: Map<string, number>;
}
