import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Application} from "@app/core";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {Execution} from '../models/execution.model';
import {GenericResourceService} from "@app/core/services/generic-resource.service";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService extends GenericResourceService<Application> {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/applications")
  }

  createApplication(name: string, archiveName: string, topologyTemplateVersionId: string, description: string): Observable<string> {
    let payload = {
      name: name,
      archiveName: archiveName,
      topologyTemplateVersionId: topologyTemplateVersionId,
      description: description
    };
    return this.handleResult<string>(this.http.post(this.endpointUrl, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }));
  }

  updateApplication(id: string, name: string, description: string): Observable<void> {
    let payload = {
      name: name,
      description: description
    };
    let urlParams = {applicationId: id};
    let url = this.getUrl("/@{applicationId}", urlParams);
    return this.handleResult<void>(this.http.put(url, payload));
  }


  checkdeploymentStatus(deploymentId: string) {
    const url = GenericResourceService.baseUrl + "/workflow_execution/s/@{deploymentId}";
    let urlParams = {deploymentId: deploymentId};
    return this.handleResult<Execution>(this.http.get(this.getParametrizedUrl(url, urlParams)));
  }
}
