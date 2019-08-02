import { Injectable } from '@angular/core';
import { LocationMatch } from '../models';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {GenericService} from "@app/core/services/generic.service";
import {GenericResourceService} from "@app/core/services/generic-resource.service";

@Injectable({
  providedIn: 'root'
})
export class LocationMatchingService extends GenericService<LocationMatch>  {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate)
  }

  match(templateId: string, environmentId: String): Observable<LocationMatch[]> {
    const url =  GenericResourceService.baseUrl + "/topologies/@{templateId}/locations?environmentId=@{environmentId}"
    let urlParams  = {templateId: templateId , environmentId: environmentId}
    return this.handleResult<LocationMatch[]>(this.http.get(this.getParametrizedUrl(url,urlParams)));
  }

}
