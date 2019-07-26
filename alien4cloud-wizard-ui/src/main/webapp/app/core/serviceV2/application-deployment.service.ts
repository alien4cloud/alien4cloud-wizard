import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { V2GenericService } from './generic.service';
import { Deployment, MultipleDataResult } from '../models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationDeploymentService extends V2GenericService<Deployment> {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/applications/deployment")
  }


  deployApplication(applicationId: String, applicationEnvironmentId: String) {
    let payload = { "applicationId": applicationId, "applicationEnvironmentId": applicationEnvironmentId };
    return this.http.post(this.getUrl(), payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).pipe(
      data => data);
  }
}
