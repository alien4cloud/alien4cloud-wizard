import {Component, Input, OnInit} from '@angular/core';
import {WizardFromComponent} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.component";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/fsm/application-wizard-machine.schema";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/fsm/application-wizard-machine.service";
import {DoCreateApplication} from "@app/features/application-wizard/fsm/application-wizard-machine.events";
import {WizardFormStep} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.schema";

@Component({
  selector: 'w4c-application-create',
  templateUrl: './application-create.component.html',
  styleUrls: ['./application-create.component.css']
})
export class ApplicationCreateComponent implements OnInit, WizardFromComponent {

  applicationName: string;
  applicationDescription: string;

  @Input() fsmContext: ApplicationWizardMachineContext;
  @Input() wizardFormStep: WizardFormStep;

  constructor(private fsm: AppplicationWizardMachineService) { }

  ngOnInit() {
    if (this.fsmContext) {
      this.applicationName = this.fsmContext.applicationName;
      this.applicationDescription = this.fsmContext.applicationDescription;
    }
  }

  createApp() {
    this.fsm.send(new DoCreateApplication(this.applicationName, this.applicationDescription));
  }

}
