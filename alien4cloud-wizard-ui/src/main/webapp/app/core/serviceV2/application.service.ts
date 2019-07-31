import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Application} from "@app/core";
import {TranslateService} from "@ngx-translate/core";
import {V2GenericService} from "@app/core/serviceV2/generic.service";
import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";
import { DeploymentTopologyDTO } from '../models/deployment-topology-dto.model';
import { Deployment } from '../models/deployment.model';
import { AppCreationTopoPayload } from '../models';


@Injectable({
  providedIn: 'root'
})
export class V2ApplicationService extends V2GenericService<Application> {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/applications")
  }

  createApplication(payload: AppCreationTopoPayload): Observable<string> {
    return this.handleResult<string>(this.http.post(this.getUrl(), payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }));
  }

  getDeploymentTopology(applicationId: string, environmentId: String): Observable<DeploymentTopologyDTO> {
    const url =  V2GenericService.baseUrl + "/applications/@{applicationId}/environments/@{environmentId}/deployment-topology"
    let urlParams  = {applicationId: applicationId , environmentId: environmentId}
    return this.handleResult<DeploymentTopologyDTO>(this.http.get(this.getCustomUrl(url,urlParams)));
    /*
    return this.http.get(this.getCustomUrl(url,urlParams)) 
      //if api returns any data
      .pipe( map(data => <DeploymentTopologyDTO>data['data']));
      */
  }

  getMonitoredDeploymentDTO(applicationId: string, environmentId: String): Observable<Deployment> { 
    const url =  V2GenericService.baseUrl + "/applications/@{applicationId}/environments/@{environmentId}/active-deployment-monitored"
    let urlParams  = {applicationId: applicationId , environmentId: environmentId}
    return this.handleResult<Application>(this.http.get(this.getCustomUrl(url,urlParams)));
   
  }

  //  /applications/@{applicationId}/environments/@{environmentId}/active-deployment-monitored

}