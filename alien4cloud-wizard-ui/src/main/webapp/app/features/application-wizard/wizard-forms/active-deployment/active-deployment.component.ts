import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import { WizardFormComponent } from '../../core/wizard.model';
import { ApplicationWizardMachineContext } from '../../core/fsm.model';
import { AppplicationWizardMachineService } from '../../core/fsm.service';
import {Subscription, timer} from 'rxjs'
import {MonitorDeploymentService} from "@app/core/services/monitor-deployment.service";
import {map} from "rxjs/operators";
import {DeploymentWorkflowExecutionService} from "@app/core/services/workflow-execution.service";
import {DeploymentStatus, ExecutionStatus, MonitoredDeploymentDTO, Task, WorkflowExecutionDTO} from "@app/core";
import {DoSubmitDeployment, DoSubmitUndeployment} from '../../core/fsm.events';
import {WebsocketSubscriptionManager} from "@app/core/services/websocket-subscription-manager.service";
import {PaaSDeploymentStatusMonitorEvent} from "@app/core/models/monitor-event.model";

@Component({
  selector: 'w4c-active-deployment',
  templateUrl: './active-deployment.component.html',
  styleUrls: ['./active-deployment.component.css']
})
export class ActiveDeploymentComponent implements OnInit, OnDestroy, WizardFormComponent {

  @Input() fsmContext: ApplicationWizardMachineContext;
  private isWorkflowInProgress: boolean = false;
  private monitoredDeployment: MonitoredDeploymentDTO;

  private wsSubscription: Subscription;
  private workflowMonitoringSubscription: Subscription;

  ngOnInit() {
    this.wsSubscription = this.websocketService.registerEnvironmentStatusChannel(this.fsmContext.environmentId).subscribe(event =>
      {
        console.log("Event received: ", event);
        let paaSDeploymentStatusMonitorEvent = <PaaSDeploymentStatusMonitorEvent>event;
        if (paaSDeploymentStatusMonitorEvent) {
          this.fsmContext.deploymentStatus = paaSDeploymentStatusMonitorEvent.deploymentStatus;
          this.fsmContext.deploymentId = paaSDeploymentStatusMonitorEvent.deploymentId;
          if (DeploymentStatus.isPendingStatus(this.fsmContext.deploymentStatus)) {
            console.log(`The status received (${this.fsmContext.deploymentStatus}) is a pending status, so monitor the workflow`);
            this.monitorWorkflow();
          } else {
            console.log(`The status received (${this.fsmContext.deploymentStatus}) is a NOT pending status do nothing`);
          }
        }
      }
    );

    if (this.fsmContext.deploymentStatus && DeploymentStatus.isPendingStatus(this.fsmContext.deploymentStatus)) {
      this.monitorWorkflow();
    }

  }

  private progessBarData: ProgessBarData;

  ngOnDestroy(): void {
    if (this.workflowMonitoringSubscription && !this.workflowMonitoringSubscription.closed)  {
      // FIXME: this does'nt seem to work. If I trigger a wf and leave the page (go Home), the polling still running !
      this.workflowMonitoringSubscription.unsubscribe();
    }
    this.wsSubscription.unsubscribe();
  }

  private monitorWorkflow() {
    if (!this.workflowMonitoringSubscription || this.workflowMonitoringSubscription.closed) {
      this.monitorDeploymentService.getMonitoredDeploymentDTO(this.fsmContext.applicationId, this.fsmContext.environmentId).subscribe(e => {
        console.log("deploymentID is : " + e.deployment.id);
        let deploymentId = e.deployment.id;
        console.log("Motitored deployement: ", JSON.stringify(e));
        this.monitoredDeployment = e;
        this.isWorkflowInProgress = true;
        // now poll the deployment
        this.workflowMonitoringSubscription = this.deploymentWorkflowExecutionService.monitorWorkflowExecution(deploymentId).subscribe(dto => {
          console.log("Returned execution: ", JSON.stringify(dto));
          this.updateProgessData(dto);
        }, error => {
        }, () => {
          this.isWorkflowInProgress = false;
        });
      });
    }
  }

  constructor(
    private fsm: AppplicationWizardMachineService,
    private monitorDeploymentService: MonitorDeploymentService,
    private deploymentWorkflowExecutionService: DeploymentWorkflowExecutionService
    ,private websocketService: WebsocketSubscriptionManager
  ) { }

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


  doUndeploy(){
    console.log("About to Undeploy with deployment status : ===>"+this.fsmContext.deploymentStatus);
    this.fsm.send(new DoSubmitUndeployment());   
  }

  doDeploy() {
    this.fsm.send(new DoSubmitDeployment());
  }

}

export class ProgessBarData {
  public workflowName: string;
  public progress: number;
  public status: ExecutionStatus;
  public current: Task;
}
