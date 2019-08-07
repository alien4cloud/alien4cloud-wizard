import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationOverview, DeploymentStatus } from '@app/core';

@Pipe({
  name: 'buttonLabel'
})
export class ButtonLabelPipe implements PipeTransform {

  transform(value: String): any {

    switch (value) {
      case DeploymentStatus.UNDEPLOYED: {
        return "Deploy";
        break;
      }
      case DeploymentStatus.DEPLOYED: {
        return "Undeploy";
        break;
      }
      default: {
        return "Undeploy"
        break;
      }
    }
  }
}
