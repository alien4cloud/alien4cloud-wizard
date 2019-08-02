import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApplicationEnvironment} from "@app/core";
import {TranslateService} from "@ngx-translate/core";
import {GenericResourceService} from "@app/core/service/generic-resource.service";
import {Observable} from "rxjs";
import {DeploymentTopologyDTO} from "@app/core/models/deployment-topology.model";
import {Deployment} from "@app/core/models/deployment.model";


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

  getDeploymentTopology(applicationId: string, environmentId: String): Observable<DeploymentTopologyDTO> {
    const url = this.getUrl("/@{environmentId}/deployment-topology");
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    return this.handleResult<DeploymentTopologyDTO>(this.http.get(this.getParametrizedUrl(url, urlParams)));
  }

  getMonitoredDeploymentDTO(applicationId: string, environmentId: String): Observable<Deployment> {
    const url = this.getUrl("/@{environmentId}/active-deployment-monitored");
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    return this.handleResult<Deployment>(this.http.get(this.getParametrizedUrl(url, urlParams)));
  }

  setLocationPolicies(applicationId: String, envId: String, orchestratorId: string, locationId: string): Observable<{}> {
    let urlParams = {applicationId: applicationId, environmentId: envId};
    let url = this.getUrl("/@{environmentId}/deployment-topology/location-policies", urlParams);
    let payload = {"orchestratorId": orchestratorId, "groupsToLocations": {"_A4C_ALL": locationId}}
    return this.handleResult<{}>(this.http.post(url, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
  }

}
