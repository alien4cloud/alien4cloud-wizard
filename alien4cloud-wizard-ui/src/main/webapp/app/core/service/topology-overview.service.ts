import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MultipleDataResult, TopologyOverview} from "@app/core";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {GenericResourceService} from "@app/core/service/generic-resource.service";


@Injectable({
  providedIn: 'root'
})
export class TopologyOverviewService extends GenericResourceService<TopologyOverview> {

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
