import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApplicationEnvironment, GenericService, MonitoredDeploymentDTO} from "@app/core";
import {TranslateService} from "@ngx-translate/core";
import {GenericResourceService} from "@app/core/services/generic-resource.service";
import {forkJoin, from, Observable, of, timer} from "rxjs";
import {DeploymentTopologyDTO} from "@app/core/models/deployment-topology.model";
import {Deployment} from "@app/core/models/deployment.model";
import {concatMap, delay} from 'rxjs/operators';
import {concat} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MonitorDeploymentService extends GenericService<MonitoredDeploymentDTO> {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate)
  }

  getMonitoredDeploymentDTO(applicationId: string, environmentId: String): Observable<MonitoredDeploymentDTO> {
    const url = GenericService.baseUrl + "/applications/@{applicationId}/environments/@{environmentId}/active-deployment-monitored";
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    return this.handleResult(this.http.get(this.getParametrizedUrl(url, urlParams)));
  }

}
