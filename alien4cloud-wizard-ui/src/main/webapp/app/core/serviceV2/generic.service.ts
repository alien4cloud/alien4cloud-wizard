import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import {MultipleDataResult} from "@app/core";
import * as _ from "lodash";

export abstract class V2GenericService<T> {

  protected static baseUrl = '/api/rest/latest';
  private endpointUrl : string;

  constructor(
    protected http: HttpClient,
    protected translate: TranslateService,
    protected apiUrl: string)
  {
    this.endpointUrl = V2GenericService.baseUrl + this.apiUrl;
  }

  /**
   *
   * @param from
   * @param size
   * @param query
   * @param urlParams must be passed if the url provided by the implementation contains '@{stuff}'.
   */
  search(from?: number, size?: number, query?: string, urlParams?: any): Observable<MultipleDataResult<T>> {
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
    return this.handleResult<MultipleDataResult<T>>(this.http.post(this.getUrl(urlParams) + "/search", data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
        'A4C-Agent': 'Wizard_UI'
      }),
    }));
  }

  /**
   * Replace all occurrences of params in the endpoint url by the corresponding entry in the urlParams.
   * For example, is the endpoint url is <code>/shops/@{shopId}/employees</code>, and the urlParams is <code>{shopId: "123"}</code>,
   * then the returned url will be : <code>/shops/123/employees</code>.
   *
   * @param urlParams
   */
  protected getUrl(urlParams?: any) : string {
    return this.getCustomUrl(this.endpointUrl, urlParams);
  }

  protected getCustomUrl(customUrl: string, urlParams?: any) : string {
    let url = customUrl;
    if (urlParams) {
      console.log("url before replacmeent: ", url);
      Object.entries(urlParams).forEach(([name, value]) => {
        console.log(`Entry ${name}: ${value}`);
        url = _.replace(url, `\@\{${name}\}`, value.toString());
        console.log("url: ", url);
      });
      console.log("url after replacmeent: ", url);
      // TODO: throw an error if the url still contain some @{param} ...
    }
    return url;
  }

  /**
   * Manage the result of a REST api call :
   * <ul>
   *   <li>If an error is detected, throws a translated error.
   *   <li>Cast the returned data into the expected type.
   * </ul>
   * @param requestResult
   */
  protected handleResult<R>(requestResult: Observable<{}>) : Observable<R> {
    return requestResult.pipe(map(data => {
      if (data['error']) {
        throw new Error(this.translate.instant("ERRORS." + data['error']['code']));
      } else {
        return <R>data['data'];
      }
    }));
  }

  getById(id: string, urlParams?: any): Observable<T> {
    return this.handleResult<T>(this.http.get(this.getUrl(urlParams) + "/" + id, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
        'A4C-Agent': 'Wizard_UI'
      })
    }));
  }

  public trimName( name : string ) : string {
    return name.replace(/\s/g, "")
  }

}
