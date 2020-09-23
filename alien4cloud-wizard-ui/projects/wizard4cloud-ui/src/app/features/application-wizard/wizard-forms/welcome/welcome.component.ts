import {Component, Input} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {Init} from "@app/features/application-wizard/core/fsm.events";
import {WizardFormComponent} from "@app/features/application-wizard/core/wizard.model";

@Component({
  selector: 'w4c-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent extends WizardFormComponent {

  constructor(
    protected fsm: AppplicationWizardMachineService
  ) { super(fsm); }

  startWizard() {
    this.fsm.send(new Init());
  }

}
