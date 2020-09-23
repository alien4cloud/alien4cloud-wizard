import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ExecutionStatus, WorkflowExecutionDTO} from "@app/core/models";
import {TranslateService} from "@ngx-translate/core";
import {Observable, ReplaySubject, timer} from "rxjs";
import {concatMap, filter, map, take} from "rxjs/operators";
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "@alien4cloud/wizard4cloud-commons";
import {GenericResourceService} from "@app/core/services/generic-resource.service";


@Injectable({
  providedIn: 'root'
})
export class DeploymentWorkflowExecutionService extends GenericResourceService<WorkflowExecutionDTO> {

  private isDeployedSubject = new ReplaySubject<boolean>(1);
  public isDeployed = this.isDeployedSubject.asObservable();

  constructor(
    http: HttpClient,
    translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings
  ) {
    super(http, translate, bootstrapSettings, "/workflow_execution")
  }

  /**
   * This is a deprecated programmatic solution for our polling.
   *
   * @param deploymentId
   */
  _monitorWorkflowExecution(deploymentId: string) {
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

  /**
   * After a given delay (500 ms) start polling the /workflow_execution endpoint.
   * Then continue polling each 2 sec.
   * Each response should be broadcast to the subject.
   * If the execution is not in a pending status, then stop the polling and complete the subject.
   *
   * FIXME: why unsusbscribe to this does'nt stop the polling ?
   *
   *  @param deploymentId
   */
  monitorWorkflowExecution(deploymentId: string): Observable<WorkflowExecutionDTO> {

    let deploymentSubject = new ReplaySubject<WorkflowExecutionDTO>(1);

    timer(500, 1000).pipe(
      concatMap(value => this.getById(deploymentId))
    ).pipe(
      map(x => {
        deploymentSubject.next(x);
        return x;
      })
    ).pipe(
      filter(dto =>
        dto.execution
        && dto.execution.status !== ExecutionStatus.RUNNING
        && dto.execution.status !== ExecutionStatus.SCHEDULED)
    ).pipe(
      take(1)
    ).subscribe(value => {
      deploymentSubject.complete();
    });

    return deploymentSubject.asObservable();

  }

}
