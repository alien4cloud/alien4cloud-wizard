import { Injectable } from '@angular/core';
import { V2GenericService } from './generic.service';
import { EnvironmentLocation, MultipleDataResult } from '../models';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApplicationLocationService extends V2GenericService<EnvironmentLocation>  {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/topologies/@{templateId}/locations?environmentId=@{environmentId}")
  }


  getLocationRedirections(templateId: string, environmentId: String): Observable<EnvironmentLocation[]> {
    const url =  V2GenericService.baseUrl + "/topologies/@{templateId}/locations?environmentId=@{environmentId}"
    let urlParams  = {templateId: templateId , environmentId: environmentId}
    return this.handleResult<EnvironmentLocation[]>(this.http.get(this.getCustomUrl(url,urlParams)));
    /*
    return this.http.get(this.getCustomUrl(url,urlParams))
      //if api returns any data
      .pipe(map(data => <EnvironmentLocation[]>data['data']));
      */
  }


}
