export enum DeploymentStatus {
  DEPLOYED = "DEPLOYED",
  UNDEPLOYED = "UNDEPLOYED",
  INIT_DEPLOYMENT = "INIT_DEPLOYMENT",
  DEPLOYMENT_IN_PROGRESS = "DEPLOYMENT_IN_PROGRESS",
  UPDATE_IN_PROGRESS = "UPDATE_IN_PROGRESS",
  UPDATED = "UPDATED",
  UNDEPLOYMENT_IN_PROGRESS = "UNDEPLOYMENT_IN_PROGRESS",
  WARNING = "WARNING",
  FAILURE = "FAILURE",
  UPDATE_FAILURE = "UPDATE_FAILURE",
  UNKNOWN = "UNKNOWN"
}

export namespace DeploymentStatus {
  /**
   * Indicates that the status is a changing status, a "doing something" status.
   */
  export function isPendingStatus(deploymentStatus: DeploymentStatus) : boolean {
    let result = (deploymentStatus == DeploymentStatus.INIT_DEPLOYMENT
      || deploymentStatus == DeploymentStatus.DEPLOYMENT_IN_PROGRESS
      || deploymentStatus == DeploymentStatus.UNDEPLOYMENT_IN_PROGRESS
      || deploymentStatus == DeploymentStatus.UPDATE_IN_PROGRESS);
    console.log(`isPendingStatus called for ${deploymentStatus}, result is : ${result}`);
    return result;
  }
}

