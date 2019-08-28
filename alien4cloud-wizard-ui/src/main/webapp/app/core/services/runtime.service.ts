import { Injectable } from '@angular/core';
import { TopologyDTO } from '../models';
import { GenericResourceService } from './generic-resource.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { GenericService } from './generic.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RuntimeService extends GenericResourceService<TopologyDTO> {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) { 
    super(http, translate, "/runtime/@{applicationId}/environment/@{environmentId}/topology");
  }

  getDeployedTopology(applicationId: string, environmentId: string) : Observable<TopologyDTO> {
    console.log(`getDeploymentTopology: applicationId:${applicationId}, environmentId:${environmentId}`);
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    const url = this.getUrl("", urlParams);
    return this.handleResult<TopologyDTO>(this.http.get(url));
  }
}
