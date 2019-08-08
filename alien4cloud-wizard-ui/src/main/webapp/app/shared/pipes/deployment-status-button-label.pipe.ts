import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationOverview, DeploymentStatus } from '@app/core';

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
        return "Undeploy"
        break;
      }
    }
  }
}
