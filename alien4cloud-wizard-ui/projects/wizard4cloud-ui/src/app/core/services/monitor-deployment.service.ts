import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MonitoredDeploymentDTO} from "@app/core/models";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "@alien4cloud/wizard4cloud-commons";
import {GenericService} from "@alien4cloud/wizard4cloud-commons";

@Injectable({
  providedIn: 'root'
})
export class MonitorDeploymentService extends GenericService {

  constructor(
    http: HttpClient,
    translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings
  ) {
    super(http, translate, bootstrapSettings)
  }

  getMonitoredDeploymentDTO(applicationId: string, environmentId: String): Observable<MonitoredDeploymentDTO> {
    const url = this.baseUrl + "/applications/@{applicationId}/environments/@{environmentId}/active-deployment-monitored";
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    return this.handleResult(this.http.get(this.getParametrizedUrl(url, urlParams)));
  }

}
