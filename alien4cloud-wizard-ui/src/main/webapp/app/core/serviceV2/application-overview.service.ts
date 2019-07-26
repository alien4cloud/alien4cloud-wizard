import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationOverview, GenericsService, MultipleDataResult} from "@app/core";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {V2GenericService} from "@app/core/serviceV2/generic.service";


@Injectable({
  providedIn: 'root'
})
export class V2ApplicationOverviewService extends V2GenericService<ApplicationOverview> {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/wizard/applications/overview")
  }

  search(from?: number, size?: number, query?: string, options?: any): Observable<MultipleDataResult<ApplicationOverview>> {
    throw new Error("Not implemented !");
  }

}
