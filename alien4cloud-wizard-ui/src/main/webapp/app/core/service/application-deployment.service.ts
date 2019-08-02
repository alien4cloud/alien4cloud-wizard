import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Deployment} from '../models/deployment.model';
import {GenericService} from "@app/core/service/generic.service";

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

}
