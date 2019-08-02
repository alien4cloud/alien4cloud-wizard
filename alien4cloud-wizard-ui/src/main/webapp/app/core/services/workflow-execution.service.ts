import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ExecutionStatus, WorkflowExecutionDTO} from "@app/core";
import {TranslateService} from "@ngx-translate/core";
import {GenericResourceService} from "@app/core/services/generic-resource.service";
import {Observable, ReplaySubject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class DeploymentWorkflowExecutionService extends GenericResourceService<WorkflowExecutionDTO> {

  private isDeployedSubject = new ReplaySubject<boolean>(1);
  public isDeployed = this.isDeployedSubject.asObservable();

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/workflow_execution")
  }

  monitorWorkflowExecution(deploymentId: string) {
    this.getById(deploymentId).subscribe(dto => {
      // FIXME: find a better solution using rxjs
      if (dto.execution && dto.execution.status.toString() !== "RUNNING") {
        console.log(`Execution is ${dto.execution.id} is finally in status : ${dto.execution.status}`)
        // stuff is done
        this.isDeployedSubject.next(true);
      } else {
        if (dto.execution) {
          console.log(`Execution is ${dto.execution.id} now in status : ${dto.execution.status}`)
        } else {
          console.log("No execution at all for the moment");
        }
        this.isDeployedSubject.next(false);
        setTimeout(() => {
          this.monitorWorkflowExecution(deploymentId);
        }, 1000);
      }
    })
  }

}
