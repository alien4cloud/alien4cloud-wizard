import {Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {OnMatchingCompleted} from "@app/features/application-wizard/core/fsm.events";
import {MatRadioChange} from "@angular/material";
import {DeploymentTopologyService} from "@app/core";
import {WizardFormComponent} from "@app/features/application-wizard/core/wizard.model";

@Component({
  selector: 'w4c-nodes-matching',
  templateUrl: './nodes-matching.component.html',
  styleUrls: ['./nodes-matching.component.css']
})
export class NodesMatchingComponent extends WizardFormComponent {

  constructor(
    protected fsm: AppplicationWizardMachineService,
    private deploymentTopologyService: DeploymentTopologyService
  ) { super(fsm); }

  changeSubstitution(nodeName: string, e: MatRadioChange) {
    console.log(`Substitution has changed for ${nodeName}:`, e.value);
    this.deploymentTopologyService
      .updateSubstitution(this.fsmContext.application.id, this.fsmContext.environment.id, nodeName, e.value)
      .subscribe(dto => { this.fsmContext.deploymentTopology = dto; });
  }

  changePoliciesSubstitution(policyId: string, e: MatRadioChange) {
    console.log(`Substitution has changed for ${policyId}:`, e.value);
    this.deploymentTopologyService
      .updatePoliciesSubstitution(this.fsmContext.application.id, this.fsmContext.environment.id, policyId, e.value)
      .subscribe(dto => { this.fsmContext.deploymentTopology = dto; }
      );
  }

  doCompleteMatching() {
    this.fsm.send(new OnMatchingCompleted(this.fsmContext.deploymentTopology));
  }

}
