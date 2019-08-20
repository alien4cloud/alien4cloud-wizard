import {Component, Input, OnInit} from '@angular/core';
import {WizardFormComponent} from "@app/features/application-wizard/core/wizard.model";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {OnFormCompleted} from "@app/features/application-wizard/core/fsm.events";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";

@Component({
  selector: 'w4c-deployment-artifacts',
  templateUrl: './deployment-artifacts.component.html',
  styleUrls: ['./deployment-artifacts.component.css']
})
export class DeploymentArtifactsComponent implements OnInit, WizardFormComponent {

  @Input() fsmContext: ApplicationWizardMachineContext;

  constructor(private fsm: AppplicationWizardMachineService) { }

  ngOnInit() {
  }

  formIsValid() {
    return true;
  }

  doSubmitForm() {
    this.fsm.send(new OnFormCompleted());
  }

}
