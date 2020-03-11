import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import { environment } from '../../../environments/environment';
import * as _ from "lodash";

export abstract class GenericService {

  public static BASE_URL = environment.urlPrefix + 'rest/latest';

  constructor(
    protected http: HttpClient,
    protected translate: TranslateService)
  {}

  protected getParametrizedUrl(templatedUrl: string, urlParams?: any) : string {
    let url = templatedUrl;
    if (urlParams) {
      // console.log("url before replacement: ", url);
      Object.entries(urlParams).forEach(([name, value]) => {
        // console.log(`Entry ${name}: ${value}`);
        url = _.replace(url, `\@\{${name}\}`, value.toString());
        // console.log("url: ", url);
      });
      // console.log("url after replacement: ", url);
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

}
