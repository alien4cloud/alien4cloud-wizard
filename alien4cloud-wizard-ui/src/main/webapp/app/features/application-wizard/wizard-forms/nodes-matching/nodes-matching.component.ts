import {Component, Input, OnInit} from '@angular/core';
import {WizardFormComponent} from "@app/features/application-wizard/wizard-main/wizard-main.model";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {OnMatchingCompleted} from "@app/features/application-wizard/core/fsm.events";

@Component({
  selector: 'w4c-nodes-matching',
  templateUrl: './nodes-matching.component.html',
  styleUrls: ['./nodes-matching.component.css']
})
export class NodesMatchingComponent implements OnInit, WizardFormComponent {

  @Input() fsmContext: ApplicationWizardMachineContext;

  constructor(
    private fsm: AppplicationWizardMachineService
  ) { }

  ngOnInit() {
  }

  doCompleteMatching() {
    this.fsm.send(new OnMatchingCompleted(this.fsmContext.deploymentTopology));
  }

}
