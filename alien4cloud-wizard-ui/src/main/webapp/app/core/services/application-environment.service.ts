import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApplicationEnvironment} from "@app/core";
import {TranslateService} from "@ngx-translate/core";
import {GenericResourceService} from "@app/core/services/generic-resource.service";
import {forkJoin, from, Observable, of, timer} from "rxjs";
import {DeploymentTopologyDTO} from "@app/core/models/deployment-topology.model";
import {Deployment} from "@app/core/models/deployment.model";
import {concatMap, delay} from 'rxjs/operators';
import {concat} from 'rxjs';
import { ApplicationEnvironmentDTO } from '../models';


@Injectable({
  providedIn: 'root'
})
export class ApplicationEnvironmentService extends GenericResourceService<ApplicationEnvironment> {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/applications/@{applicationId}/environments")
  }

  getDeploymentTopology(applicationId: string, environmentId: string): Observable<DeploymentTopologyDTO> {
    console.log(`getDeploymentTopology: applicationId:${applicationId}, environmentId:${environmentId}`);
    const url = this.getUrl("/@{environmentId}/deployment-topology");
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    return this.handleResult<DeploymentTopologyDTO>(this.http.get(this.getParametrizedUrl(url, urlParams)));
  }

  getMonitoredDeploymentDTO(applicationId: string, environmentId: string): Observable<Deployment> {
    const url = this.getUrl("/@{environmentId}/active-deployment-monitored");
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    return this.handleResult<Deployment>(this.http.get(this.getParametrizedUrl(url, urlParams)));
  }

  setLocationPolicies(applicationId: string, envId: string, orchestratorId: string, locationId: string): Observable<{}> {
    console.log("======= setLocationPolicies");
    let urlParams = {applicationId: applicationId, environmentId: envId};
    let url = this.getUrl("/@{environmentId}/deployment-topology/location-policies", urlParams);
    let payload = {"orchestratorId": orchestratorId, "groupsToLocations": {"_A4C_ALL": locationId}}
    const obs: Observable<{}> = this.handleResult<{}>(this.http.post(url, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
    return obs;
    // FIXME: here we simulate on long running backend operation
    // return timer(10000).pipe(concatMap(value => {
    //   console.log("Time expired");
    //   return obs;
    // }));
  }


  getEnvironmentApplications(applicationIds: String[]): Observable<ApplicationEnvironmentDTO[]> {
    const url = GenericResourceService.baseUrl + "/applications/environments";
    return this.handleResult<ApplicationEnvironmentDTO[]>(this.http.post(url,applicationIds));
  }
  


}
