import {Inject, Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConstraintInformation} from '@app/core/models';
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "@alien4cloud/wizard4cloud-commons";
import {GenericService} from "@alien4cloud/wizard4cloud-commons";
import {PropertyValidationRequest} from "@app/core/models/properties-validation.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PropertiesService extends GenericService {

  constructor(
    http: HttpClient,
    translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings
  ) { super(http, translate, bootstrapSettings) }

  check(request: PropertyValidationRequest) {
    return this.http.post(this.baseUrl + "/properties/check", request, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }).pipe(map(data => {
      if (data['error']) {
        if (data['error']['code'] == 800) {
          throw new Error(this.translate.instant("ERRORS.800." + data['data']['name'], {reference: data['data']['reference']}));
        } else {
          throw new Error(this.translate.instant("ERRORS." + data['error']['code']));
        }
      } else {
        return;
      }
    }))
/*
    return this.handleResult<ConstraintInformation>(this.http.post(this.baseUrl + "/properties/check", request, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
*/
  }

}
