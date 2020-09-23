import {DeploymentStatus} from "@app/core/models";

export class DeploymentStatusChangeEvent {
  constructor(public environmentId: string, public status: DeploymentStatus) {
  }
}
