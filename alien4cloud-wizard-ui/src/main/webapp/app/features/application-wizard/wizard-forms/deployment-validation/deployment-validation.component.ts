import { Component, Input } from '@angular/core';
import { ApplicationWizardMachineContext } from '../../core/fsm.model';
import { AppplicationWizardMachineService } from '../../core/fsm.service';
import { DoSubmitDeployment } from '../../core/fsm.events';
import { WizardFormComponent } from "@app/features/application-wizard/core/wizard.model";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'w4c-deployment-validation',
  templateUrl: './deployment-validation.component.html',
  styleUrls: ['./deployment-validation.component.css']
})
export class DeploymentValidationComponent extends WizardFormComponent {

  constructor(
    protected fsm: AppplicationWizardMachineService
  ) { super(fsm); }

  deployApp() {
    this.fsm.send(new DoSubmitDeployment());
  }

}
