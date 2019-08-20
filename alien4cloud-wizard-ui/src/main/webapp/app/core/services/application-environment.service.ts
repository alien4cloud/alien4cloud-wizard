import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationEnvironment, ApplicationEnvironmentDTO, DeploymentStatus} from "@app/core";
import {TranslateService} from "@ngx-translate/core";
import {GenericResourceService} from "@app/core/services/generic-resource.service";
import {Observable} from "rxjs";
import {Deployment} from "@app/core/models/deployment.model";

@Injectable({
  providedIn: 'root'
})
export class ApplicationEnvironmentService extends GenericResourceService<ApplicationEnvironmentDTO> {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/applications/@{applicationId}/environments")
  }

  getMonitoredDeploymentDTO(applicationId: string, environmentId: string): Observable<Deployment> {
    const url = this.getUrl("/@{environmentId}/active-deployment-monitored");
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    return this.handleResult<Deployment>(this.http.get(this.getParametrizedUrl(url, urlParams)));
  }

  getEnvironmentApplications(applicationIds: String[]): Observable<Map<string, ApplicationEnvironmentDTO[]>> {
    const url = GenericResourceService.BASE_URL + "/applications/environments";
    return this.handleResult<Map<string, ApplicationEnvironmentDTO[]>>(this.http.post(url,applicationIds));
  }
  
  getApplicationEnvironmentStatus(applicationId: string, environmentId: string): Observable<DeploymentStatus> {
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    let url = this.getUrl("/@{environmentId}/status", urlParams);
    return this.handleResult<DeploymentStatus>(this.http.get(url));
  }

  getApplicationEnvironmentDTO(applicationId: string, environmentId: string): Observable<ApplicationEnvironmentDTO> {
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    let url = this.getUrl("/@{environmentId}", urlParams);
    return this.handleResult<ApplicationEnvironmentDTO>(this.http.get(url));
  }

}
