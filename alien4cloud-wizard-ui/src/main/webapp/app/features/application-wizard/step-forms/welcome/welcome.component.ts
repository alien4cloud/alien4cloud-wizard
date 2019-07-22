import {Component, Input, OnInit} from '@angular/core';
import {WizardFromComponent} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.component";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/fsm/application-wizard-machine.schema";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/fsm/application-wizard-machine.service";
import {Init} from "@app/features/application-wizard/fsm/application-wizard-machine.events";
import {WizardFormStep} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.schema";

@Component({
  selector: 'w4c-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, WizardFromComponent {

  @Input() fsmContext: ApplicationWizardMachineContext;
  @Input() wizardFormStep: WizardFormStep;

  constructor(private fsm: AppplicationWizardMachineService) { }

  ngOnInit() {
  }

  startWizard() {
    this.fsm.send(new Init());
  }

}
