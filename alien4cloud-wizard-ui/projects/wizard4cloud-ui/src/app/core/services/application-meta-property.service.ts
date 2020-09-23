import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "@alien4cloud/wizard4cloud-commons";
import {ConstraintError, ConstraintInformation} from "@app/core/models";
import {GenericService} from "@alien4cloud/wizard4cloud-commons";
import {PropertyRequest} from "@alien4cloud/wizard4cloud-commons";

@Injectable({
  providedIn: 'root'
})
export class ApplicationMetaPropertyService extends GenericService {

  constructor(
    http: HttpClient,
    translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings
  ) {
    super(http, translate, bootstrapSettings)
  }

  upsertProperty(applicationId: string, propertyRequest: PropertyRequest): Observable<ConstraintInformation> {
    let params = { applicationId: applicationId};
    let url = "/applications/@{applicationId}/properties";
    return this.http.post(this.baseUrl + this.getParametrizedUrl(url, params), propertyRequest, {
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
