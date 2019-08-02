import { Component, OnInit, Input } from '@angular/core';
import { WizardFormComponent } from '../../core/wizard.model';
import { ApplicationWizardMachineContext } from '../../core/fsm.model';
import { AppplicationWizardMachineService } from '../../core/fsm.service';
import { timer } from 'rxjs'
import {MonitorDeploymentService} from "@app/core/services/monitor-deployment.service";
import {map} from "rxjs/operators";
import {DeploymentWorkflowExecutionService} from "@app/core/services/workflow-execution.service";

@Component({
  selector: 'w4c-active-deployment',
  templateUrl: './active-deployment.component.html',
  styleUrls: ['./active-deployment.component.css']
})
export class ActiveDeploymentComponent implements OnInit,WizardFormComponent {

  @Input() fsmContext: ApplicationWizardMachineContext;
  private isDeploying: boolean = true;

  constructor(
    private fsm: AppplicationWizardMachineService,
    private monitorDeploymentService: MonitorDeploymentService,
    private deploymentWorkflowExecutionService: DeploymentWorkflowExecutionService
  ) { }

  ngOnInit() {
    this.monitorDeploymentService.getMonitoredDeploymentDTO(this.fsmContext.applicationId, this.fsmContext.environmentId).subscribe(value => {
      console.log("deploymentID is : " + value.deployment.id);
      let deploymentId = value.deployment.id;
      // now poll the deployment
      this.deploymentWorkflowExecutionService.monitorWorkflowExecution(deploymentId);
      this.deploymentWorkflowExecutionService.isDeployed.subscribe(deployed => {
        console.log("deployed: ", deployed)
        if (deployed) {
          this.isDeploying = false;
        }
      })
    });
  }
}
