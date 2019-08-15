import {Component, Input, OnInit} from '@angular/core';
import {WizardFormComponent} from "@app/features/application-wizard/wizard-main/wizard-main.model";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {OnMatchingCompleted} from "@app/features/application-wizard/core/fsm.events";
import {MatRadioChange} from "@angular/material";
import {DeploymentTopologyService} from "@app/core";

@Component({
  selector: 'w4c-nodes-matching',
  templateUrl: './nodes-matching.component.html',
  styleUrls: ['./nodes-matching.component.css']
})
export class NodesMatchingComponent implements OnInit, WizardFormComponent {

  @Input() fsmContext: ApplicationWizardMachineContext;

  constructor(
    private fsm: AppplicationWizardMachineService,
    private deploymentTopologyService: DeploymentTopologyService
  ) { }

  ngOnInit() {
  }

  changeSubstitution(nodeName: string, e: MatRadioChange) {
    console.log(`Substitution has changed for ${nodeName}:`, e.value);
    this.deploymentTopologyService
      .updateSubstitution(this.fsmContext.applicationId, this.fsmContext.environmentId, nodeName, e.value)
      .subscribe(dto => { this.fsmContext.deploymentTopology = dto; }
      );
  }

  doCompleteMatching() {
    this.fsm.send(new OnMatchingCompleted(this.fsmContext.deploymentTopology));
  }

}
