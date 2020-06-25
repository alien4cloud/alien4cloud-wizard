import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Application} from "@app/core";
import {TranslateService} from "@ngx-translate/core";
import {Observable, of} from "rxjs";
import {Execution} from '../models/execution.model';
import {GenericResourceService} from "@app/core/services/generic-resource.service";
import {GenericService} from "@app/core/services/generic.service";
import {catchError} from "rxjs/operators";

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
    }).pipe(catchError(err => {
      console.log("====== Error catched", JSON.stringify(err));
      throw new Error(this.translate.instant("ERRORS." + err['error']['error']['code']));
    })));
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
    let urlParams = {deploymentId: deploymentId};
    let url = this.getUrl("/workflow_execution/s/@{deploymentId}", urlParams);
    return this.handleResult<Execution>(this.http.get(url));
  }

  // FIXME: generalize ?
  delete(id: string): Observable<boolean> {
    let urlParams = {id: id};
    let url = this.getUrl("/@{id}", urlParams);
    return this.handleResult<boolean>(this.http.delete(url).pipe(catchError(err => {
      console.log("====== Error catched", JSON.stringify(err));
      throw new Error(this.translate.instant("ERRORS." + err['error']['error']['code']));
    })));
  }

  getApplicationNameSuggestion(applicationName: string): Observable<String> {
    let urlParams = {applicationName: applicationName};
    let url = GenericService.BASE_URL + this.getParametrizedUrl("/wizard/applications/suggestion/@{applicationName}", urlParams);
    return this.handleResult<String>(this.http.get(url));
  }

}
