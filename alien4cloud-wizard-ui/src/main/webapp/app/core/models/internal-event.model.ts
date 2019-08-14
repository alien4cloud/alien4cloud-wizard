import {DeploymentStatus} from "@app/core";

export class DeploymentStatusChangeEvent {
  constructor(public environmentId: string, public status: DeploymentStatus) {
  }
}
