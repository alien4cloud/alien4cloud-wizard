import {Inject, Injectable} from '@angular/core';
import { LocationMatch } from '../models';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "@alien4cloud/wizard4cloud-commons";
import {GenericService} from "@alien4cloud/wizard4cloud-commons";

@Injectable({
  providedIn: 'root'
})
export class LocationMatchingService extends GenericService  {

  constructor(
    http: HttpClient,
    translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings
  ) {
    super(http, translate, bootstrapSettings)
  }

  match(templateId: string, environmentId: String): Observable<LocationMatch[]> {
    const url =  this.baseUrl + "/topologies/@{templateId}/locations?environmentId=@{environmentId}"
    let urlParams  = {templateId: templateId , environmentId: environmentId}
    return this.handleResult<LocationMatch[]>(this.http.get(this.getParametrizedUrl(url,urlParams)));
  }

}
