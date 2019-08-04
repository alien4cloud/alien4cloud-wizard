import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Deployment} from '@app/core/models';
import {GenericService} from "@app/core/services/generic.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApplicationDeploymentService extends GenericService<Deployment> {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) { super(http, translate) }

  deploy(applicationId: String, applicationEnvironmentId: String) {
    let payload = {"applicationId": applicationId, "applicationEnvironmentId": applicationEnvironmentId};
    return this.handleResult<{}>(this.http.post(GenericService.baseUrl+"/applications/deployment", payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
  }

  getActiveDeployment(applicationId: String, environmentId: String): Observable<Deployment> {
    let params = {"applicationId": applicationId, "applicationEnvironmentId": environmentId};
    return this.handleResult<Deployment>(this.http.get(GenericService.baseUrl+ this.getParametrizedUrl("/applications/@{applicationId}/environments/@{applicationEnvironmentId}/active-deployment", params), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
  }

}
