import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GenericService} from "@app/core/services/generic.service";
import {MonitoredDeploymentDTO} from "@app/core/models";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MonitorDeploymentService extends GenericService {

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
