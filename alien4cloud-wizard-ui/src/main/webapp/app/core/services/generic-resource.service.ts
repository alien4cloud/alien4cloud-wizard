import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TranslateService} from "@ngx-translate/core";
import {MultipleDataResult} from "@app/core";
import {GenericService} from "@app/core/services/generic.service";

export abstract class GenericResourceService<T> extends GenericService {

  protected endpointUrl : string;

  constructor(
    protected http: HttpClient,
    protected translate: TranslateService,
    protected apiUrl: string)
  {
    super(http, translate);
    this.endpointUrl = GenericResourceService.baseUrl + this.apiUrl;
  }

  /**
   * Replace all occurrences of params in the endpoint url by the corresponding entry in the urlParams.
   * For example, is the endpoint url is <code>/shops/@{shopId}/employees</code>, and the urlParams is <code>{shopId: "123"}</code>,
   * then the returned url will be : <code>/shops/123/employees</code>.
   *
   * @param urlParams
   */
  protected getUrl(urlSuffixe: string, urlParams?: any) : string {
    let url = this.endpointUrl + urlSuffixe;
    return this.getParametrizedUrl(url, urlParams);
  }

  /**
   *
   * @param from
   * @param size
   * @param query
   * @param urlParams must be passed if the url provided by the implementation contains '@{stuff}'.
   */
  search(from?: number, size?: number, query?: string, filters?: any, urlParams?: any): Observable<MultipleDataResult<T>> {
    if (!from) {
      from = 0;
    }
    if (!size) {
      size = 20;
    }
    if (!query) {
      query = "";
    }
    if (!filters) {
      filters = {};
    }
    let data = {"from": from, "size": size, "query": query, "filters": filters};
    // TODO: use option to replace @{stuffs}
    return this.handleResult<MultipleDataResult<T>>(this.http.post(this.getUrl("", urlParams) + "/search", data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
        'A4C-Agent': 'Wizard_UI'
      }),
    }));
  }

  getById(id: string, urlParams?: any): Observable<T> {
    return this.handleResult<T>(this.http.get(this.getUrl("", urlParams) + "/" + id, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
        'A4C-Agent': 'Wizard_UI'
      })
    }));
  }

}
