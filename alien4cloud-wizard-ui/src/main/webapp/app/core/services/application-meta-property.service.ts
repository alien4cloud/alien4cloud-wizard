import {Injectable} from '@angular/core';
import {GenericService} from "./generic.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {ConstraintError, ConstraintInformation, DeploymentTopologyDTO, PropertyRequest} from "@app/core/models";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApplicationMetaPropertyService extends GenericService {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate)
  }

  upsertProperty(applicationId: string, propertyRequest: PropertyRequest): Observable<ConstraintInformation> {
    let params = { applicationId: applicationId};
    let url = "/applications/@{applicationId}/properties";
    return this.http.post(GenericService.BASE_URL+ this.getParametrizedUrl(url, params), propertyRequest, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }).pipe(map(data => {
      if (data['error']) {
        let ci = <ConstraintInformation>data['data'];
        // FIXME : translate error : this.translate.instant("ERRORS." + data['error']['code'], ci)
        throw new ConstraintError(data['error']['code'], data['error']['message'], ci);
      } else {
        return <ConstraintInformation>data['data'];
      }
    }));
  }

}
