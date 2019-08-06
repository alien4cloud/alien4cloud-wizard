import { Component, OnInit, Input } from '@angular/core';
import { WizardFormComponent } from '../../core/wizard.model';
import { ApplicationWizardMachineContext } from '../../core/fsm.model';
import { AppplicationWizardMachineService } from '../../core/fsm.service';
import { timer } from 'rxjs'
import {MonitorDeploymentService} from "@app/core/services/monitor-deployment.service";
import {map} from "rxjs/operators";
import {DeploymentWorkflowExecutionService} from "@app/core/services/workflow-execution.service";
import {ExecutionStatus, MonitoredDeploymentDTO, Task, WorkflowExecutionDTO} from "@app/core";
import { DoSubmitUndeployment } from '../../core/fsm.events';

@Component({
  selector: 'w4c-active-deployment',
  templateUrl: './active-deployment.component.html',
  styleUrls: ['./active-deployment.component.css']
})
export class ActiveDeploymentComponent implements OnInit,WizardFormComponent {

  @Input() fsmContext: ApplicationWizardMachineContext;
  private isDeploying: boolean = true;
  private monitoredDeployment: MonitoredDeploymentDTO;
  private progessBarData: ProgessBarData;

  constructor(
    private fsm: AppplicationWizardMachineService,
    private monitorDeploymentService: MonitorDeploymentService,
    private deploymentWorkflowExecutionService: DeploymentWorkflowExecutionService
  ) { }

  ngOnInit() {
    // FIXME : we should no use this timeout here.
    setTimeout( () =>
      this.monitorDeploymentService.getMonitoredDeploymentDTO(this.fsmContext.applicationId, this.fsmContext.environmentId).subscribe(value => {
        console.log("deploymentID is : " + value.deployment.id);
        let deploymentId = value.deployment.id;
        console.log("Motitored deployement: ", JSON.stringify(value));
        this.monitoredDeployment = value;

        // now poll the deployment
        this.deploymentWorkflowExecutionService.monitorWorkflowExecution(deploymentId).subscribe(dto => {
          console.log("Returned execution: ", JSON.stringify(dto));
          //TODO: update progess information;
          this.updateProgessData(dto);
        }, error => {}, () => {
          this.isDeploying = false;
        });
      }), 2000);
  }

  // FIXME: this logic should probably move to a service
  // not sure, since it's just UI stuffs
  private updateProgessData(wfExecution: WorkflowExecutionDTO) {
    if (!wfExecution.execution) {
      return;
    }

    if (!this.progessBarData) {
      this.progessBarData = new ProgessBarData();
    }

    this.progessBarData.workflowName = wfExecution.execution.workflowName;
    this.progessBarData.current = wfExecution.lastKnownExecutingTask;
    this.progessBarData.status = wfExecution.execution.status;

    let progress = (wfExecution.actualKnownStepInstanceCount * 100) / this.monitoredDeployment.workflowExpectedStepInstanceCount[wfExecution.execution.workflowName];
    if (wfExecution.execution.status.toString() == 'SUCCEEDED') {
      progress = 100;
    } else {
      if (progress >= 95) {
        progress = 90;
      }
    }
    this.progessBarData.progress = progress;
  }


  undeployApp(){
    console.log("About to Undeploy with deployment status : ===>"+this.fsmContext.deploymentStatus);
    this.fsm.send(new DoSubmitUndeployment());   
  }

}

export class ProgessBarData {
  public workflowName: string;
  public progress: number;
  public status: ExecutionStatus;
  public current: Task;
}
