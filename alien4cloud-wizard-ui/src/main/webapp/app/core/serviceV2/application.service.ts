import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppCreationTopoPayload, Application} from "@app/core";
import {TranslateService} from "@ngx-translate/core";
import {V2GenericService} from "@app/core/serviceV2/generic.service";
import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class V2ApplicationService extends V2GenericService<Application> {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/applications")
  }

  createApplication(payload: AppCreationTopoPayload): Observable<string> {
    console.log("topologyTemplateVersionId  :", payload.topologyTemplateVersionId)
    return this.http.post(this.endpointUrl, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).pipe(
      tap(data => console.log("==============>" + JSON.stringify(data))),
      map(data => {
        if (data['error']) {
          throw new Error(this.translate.instant("ERRORS." + data['error']['code']));
        } else {
          return data['data'];
        }
      })
    );
  }
}
