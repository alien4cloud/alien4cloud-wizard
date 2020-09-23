import {Inject, Injectable} from '@angular/core';
import { TopologyDTO } from '../models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "@alien4cloud/wizard4cloud-commons";
import {GenericResourceService} from "@app/core/services/generic-resource.service";

@Injectable({
  providedIn: 'root'
})
export class RuntimeService extends GenericResourceService<TopologyDTO> {

  constructor(
    http: HttpClient,
    translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings
  ) {
    super(http, translate, bootstrapSettings, "/runtime/@{applicationId}/environment/@{environmentId}/topology");
  }

  getDeployedTopology(applicationId: string, environmentId: string) : Observable<TopologyDTO> {
    console.log(`getDeploymentTopology: applicationId:${applicationId}, environmentId:${environmentId}`);
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    const url = this.getUrl("", urlParams);
    return this.handleResult<TopologyDTO>(this.http.get(url));
  }
}
