import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import * as _ from "lodash";
import {Inject, Optional} from "@angular/core";
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "../models/commons.model";

export abstract class GenericService {

  //TODO: fix environnment management
  //public static BASE_URL = /*environment.urlPrefix +*/ '../rest/latest';
  protected baseUrl = '../rest/latest';
  private urlPrefix: string;
  private production: boolean;

  constructor(
    protected http: HttpClient,
    protected translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings)
  {
      this.urlPrefix = bootstrapSettings.urlPrefix;
      this.production = bootstrapSettings.production;
      this.baseUrl = this.urlPrefix + '../rest/latest';
  }

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

  isProduction() {
    return this.production;
  }
  getUrlPrefix() {
    return this.urlPrefix;
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
