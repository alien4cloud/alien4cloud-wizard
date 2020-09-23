import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {Deployment} from "@app/core/models/deployment.model";
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "@alien4cloud/wizard4cloud-commons";
import {GenericResourceService} from "@app/core/services/generic-resource.service";
import {ApplicationEnvironmentDTO, DeploymentStatus} from "@app/core/models";

@Injectable({
  providedIn: 'root'
})
export class ApplicationEnvironmentService extends GenericResourceService<ApplicationEnvironmentDTO> {

  constructor(
    http: HttpClient,
    translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings
  ) {
    super(http, translate, bootstrapSettings, "/applications/@{applicationId}/environments")
  }

  getMonitoredDeploymentDTO(applicationId: string, environmentId: string): Observable<Deployment> {
    const url = this.getUrl("/@{environmentId}/active-deployment-monitored");
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    return this.handleResult<Deployment>(this.http.get(this.getParametrizedUrl(url, urlParams)));
  }

  getEnvironmentApplications(applicationIds: String[]): Observable<Map<string, ApplicationEnvironmentDTO[]>> {
    const url = this.baseUrl + "/applications/environments";
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
