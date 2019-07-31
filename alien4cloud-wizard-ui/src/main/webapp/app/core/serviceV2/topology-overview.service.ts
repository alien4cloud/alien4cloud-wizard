import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationOverview, MultipleDataResult, TopologyOverview} from "@app/core";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {V2GenericService} from "@app/core/serviceV2/generic.service";


@Injectable({
  providedIn: 'root'
})
export class V2TopologyOverviewService extends V2GenericService<TopologyOverview> {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/wizard/topologies/overview")
  }

  search(from?: number, size?: number, query?: string, options?: any): Observable<MultipleDataResult<TopologyOverview>> {
    throw new Error("Not implemented !");
  }

}