import { Pipe, PipeTransform } from '@angular/core';
import {DeploymentStatus} from "@app/core/models";

@Pipe({
  name: 'w4cDeploymentStatusButtonLabel'
})
export class DeploymentStatusButtonLabel implements PipeTransform {

  transform(value: String): any {

    switch (value) {
      case DeploymentStatus.UNDEPLOYED: {
        return "Deploy";
        break;
      }
      default: {
        return "Manage"
        break;
      }
    }
  }
}
