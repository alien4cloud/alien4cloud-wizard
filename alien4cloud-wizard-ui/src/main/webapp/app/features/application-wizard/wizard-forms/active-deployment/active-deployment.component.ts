import {Component, OnInit, Input, OnDestroy, AfterViewInit} from '@angular/core';
import {WizardFormComponent} from '../../core/wizard.model';
import {AppplicationWizardMachineService} from '../../core/fsm.service';
import {Subscription} from 'rxjs'
import {MonitorDeploymentService} from "@app/core/services/monitor-deployment.service";
import {DeploymentWorkflowExecutionService} from "@app/core/services/workflow-execution.service";
import {
  ApplicationDeploymentService,
  DeploymentStatus,
  ExecutionStatus,
  MonitoredDeploymentDTO,
  Task, Workflow,
  WorkflowExecutionDTO,
  InstanceInformation,
  TopologyDTO,
  RuntimeService
} from "@app/core";
import {DoCancelWizard, DoSubmitUndeployment} from '../../core/fsm.events';
import {WebsocketSubscriptionManager} from "@app/core/services/websocket-subscription-manager.service";
import {PaaSDeploymentStatusMonitorEvent} from "@app/core/models/monitor-event.model";
import {MatDialog} from '@angular/material';
import {ConfirmationDialogComponent} from '@app/shared';
import {FormControl} from "@angular/forms";
import * as _ from "lodash";

@Component({
  selector: 'w4c-active-deployment',
  templateUrl: './active-deployment.component.html',
  styleUrls: ['./active-deployment.component.css']
})
export class ActiveDeploymentComponent extends WizardFormComponent implements OnInit, OnDestroy {

  // @Input()
  // fsmContext: ApplicationWizardMachineContext;

  workflowInProgress: boolean = false;
  progessBarData: ProgessBarData;

  private monitoredDeployment: MonitoredDeploymentDTO;
  private wsSubscription: Subscription;
  private workflowMonitoringSubscription: Subscription;

  workflowFormCtrl = new FormControl();
  workflows = new Set<string>();

  //make lodash usable from template
  lodash = _ ;
  instanceInformations: Map<string,InstanceInformation[]>;
  topologyDTO : TopologyDTO ;

  constructor(
    protected fsm: AppplicationWizardMachineService,
    private monitorDeploymentService: MonitorDeploymentService,
    private deploymentWorkflowExecutionService: DeploymentWorkflowExecutionService,
    private applicationDeploymentService: ApplicationDeploymentService,
    private websocketService: WebsocketSubscriptionManager,
    private dialog: MatDialog,
    private runtimeService: RuntimeService
  ) {
    super(fsm);
  }

  ngOnInit() {

    this.wsSubscription = this.websocketService.registerEnvironmentStatusChannel(this.fsmContext.environment.id).subscribe(event => {
        console.log("Event received: ", event);
        let paaSDeploymentStatusMonitorEvent = <PaaSDeploymentStatusMonitorEvent>event;
        if (paaSDeploymentStatusMonitorEvent) {
          this.fsmContext.deploymentStatus = paaSDeploymentStatusMonitorEvent.deploymentStatus;
          if (DeploymentStatus.isPendingStatus(this.fsmContext.deploymentStatus)) {
            console.log(`The status received (${this.fsmContext.deploymentStatus}) is a pending status, so monitor the workflow`);
            this.monitorWorkflow();
          } else {
            console.log(`The status received (${this.fsmContext.deploymentStatus}) is a NOT pending status do nothing`);
          }
          
          //update topology attributes
          this.getInstanceInformation() ;
        }
      }
    );

    if (this.fsmContext.deploymentStatus && DeploymentStatus.isPendingStatus(this.fsmContext.deploymentStatus)) {
      this.monitorWorkflow();
    }

    // we filter workflows that have steps and exclude install and uninstall
    for (const [key, wf] of Object.entries(this.fsmContext.deploymentTopology.topology.workflows)) {
      console.log(`Workflow ${key} : ${wf.name}`);
      if (key != "install" && key != "uninstall" && _.size(wf['steps']) > 0) {
        this.workflows.add(key);
      }
      if (this.workflows.has("run")) {
        this.workflowFormCtrl.setValue("run");
      } else if (this.workflows.size > 0) {
        this.workflowFormCtrl.setValue(this.workflows.values().next().value);
      }
    }

    this.getDeployedTopology();
    this.getInstanceInformation() ;


  }

  ngOnDestroy(): void {
    if (this.workflowMonitoringSubscription && !this.workflowMonitoringSubscription.closed) {
      // FIXME: this does'nt seem to work. If I trigger a wf and leave the page (go Home), the polling still running !
      this.workflowMonitoringSubscription.unsubscribe();
    }
    this.wsSubscription.unsubscribe();
  }

  private monitorWorkflow() {
    if (!this.workflowMonitoringSubscription || this.workflowMonitoringSubscription.closed) {
      this.monitorDeploymentService.getMonitoredDeploymentDTO(this.fsmContext.application.id, this.fsmContext.environment.id).subscribe(e => {
        console.log("deploymentID is : " + e.deployment.id);
        let deploymentId = e.deployment.id;
        console.log("Motitored deployement: ", JSON.stringify(e));
        this.monitoredDeployment = e;
        this.workflowInProgress = true;
        // now poll the deployment
        this.workflowMonitoringSubscription = this.deploymentWorkflowExecutionService.monitorWorkflowExecution(deploymentId).subscribe(dto => {
          console.log("Returned execution: ", JSON.stringify(dto));
          this.updateProgessData(dto);
        }, error => {
        }, () => {
          this.workflowInProgress = false;
        });
      });
    }
  }


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

  openUndeployDialog(event: any): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '35%',
      data: {
        actionDescription: "Application undeployment",
        message: "Do you confirm the undeployment of this application?"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fsm.send(new DoSubmitUndeployment());
      }
    });
  }

  launchWorkflow() {
    let workflow = this.workflowFormCtrl.value;
    this.applicationDeploymentService.launchWorkflow(this.fsmContext.application.id, this.fsmContext.environment.id, workflow).subscribe(executionId => {
      console.log(`Execution ID for workflow ${workflow} is ${executionId}`);
      this.workflowInProgress = true;
      this.monitorWorkflow();
    });
  }

  deleteApplication() {
    this.fsm.send(new DoCancelWizard());
  }


  getInstanceInformation() {
    this.applicationDeploymentService.getInstanceInformation(this.fsmContext.application.id, this.fsmContext.environment.id).subscribe(instancesInfos => {
      this.instanceInformations = instancesInfos;
    });
  }

  getDeployedTopology() {
    this.runtimeService.getDeployedTopology(this.fsmContext.application.id, this.fsmContext.environment.id).subscribe(deplyopedTopology => {
      this.topologyDTO = deplyopedTopology;
    });
  }

}

export class ProgessBarData {
  public workflowName: string;
  public progress: number;
  public status: ExecutionStatus;
  public current: Task;
}
