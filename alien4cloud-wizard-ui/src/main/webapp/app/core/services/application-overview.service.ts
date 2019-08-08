import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationOverview, MultipleDataResult} from "@app/core";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {GenericResourceService} from "@app/core/services/generic-resource.service";


@Injectable({
  providedIn: 'root'
})
export class ApplicationOverviewService extends GenericResourceService<ApplicationOverview> {

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
