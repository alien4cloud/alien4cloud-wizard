import {Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/fsm/application-wizard-machine.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/fsm/application-wizard-machine.service";
import {Init} from "@app/features/application-wizard/fsm/application-wizard-machine.events";
import {WizardFromComponent} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.model";

@Component({
  selector: 'w4c-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, WizardFromComponent {

  @Input() fsmContext: ApplicationWizardMachineContext;

  constructor(private fsm: AppplicationWizardMachineService) { }

  ngOnInit() {
  }

  startWizard() {
    this.fsm.send(new Init());
  }

}
