import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import {MultipleDataResult} from "@app/core";

export abstract class V2GenericService<T> {

  protected static baseUrl = '/api/rest/latest';
  protected endpointUrl : string;

  constructor(
    protected http: HttpClient,
    protected translate: TranslateService,
    protected apiUrl: string)
  {
    this.endpointUrl = V2GenericService.baseUrl + this.apiUrl;
  }

  search(from?: number, size?: number, query?: string, options?: any): Observable<MultipleDataResult<T>> {
    if (!from) {
      from = 0;
    }
    if (!size) {
      size = 20;
    }
    if (!query) {
      query = "";
    }
    let data = {"from": from, "size": size, "query": query};
    // TODO: use option to replace @{stuffs}
    return this.http.post(this.endpointUrl + "/search", data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
        'A4C-Agent': 'Wizard_UI'
      }),
    }).pipe(map(data => {
      if (data['error']) {
        throw new Error(this.translate.instant("ERRORS." + data['error']['code']));
      } else {
        return <MultipleDataResult<T>> data['data'];
      }
    }));
  }

  getById(id: string): Observable<T> {
    return this.http.get(this.endpointUrl + "/" + id, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
        'A4C-Agent': 'Wizard_UI'
      })
    }).pipe(map(data => {
      if (data['error']) {
        throw new Error(this.translate.instant("ERRORS." + data['error']['code']));
      } else {
        return <T>data['data'];
      }
      }
     )
    );
  }

}
