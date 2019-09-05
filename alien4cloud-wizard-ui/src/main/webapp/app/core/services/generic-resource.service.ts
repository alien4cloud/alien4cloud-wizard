import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TranslateService} from "@ngx-translate/core";
import {FacetedSearchResult, FilteredSearchRequest} from "@app/core";
import {GenericService} from "@app/core/services/generic.service";

export abstract class GenericResourceService<T> extends GenericService {

  protected endpointUrl : string;

  constructor(
    protected http: HttpClient,
    protected translate: TranslateService,
    protected apiUrl: string)
  {
    super(http, translate);
    this.endpointUrl = GenericResourceService.BASE_URL + this.apiUrl;
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
  search(request: FilteredSearchRequest, urlParams?: any): Observable<FacetedSearchResult<T>> {
    return this.handleResult<FacetedSearchResult<T>>(this.http.post(this.getUrl("", urlParams) + "/search", request, {
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
