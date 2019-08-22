import {Injectable} from '@angular/core';
import {
  BasicSearchRequest,
  MultipleDataResult,
  PaaSDeploymentLog,
  SortConfiguration
} from "@app/core/models";
import {GenericResourceService} from "@app/core/services";
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApplicationLogService extends GenericResourceService<PaaSDeploymentLog> {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/applications/@{applicationId}")
  }

  searchEnvironmentLogs(applicationId: string, applicationEnvironmentId: string, searchLogRequest: SearchLogRequest): Observable<MultipleDataResult<PaaSDeploymentLog>> {
    let urlParams = {applicationId: applicationId, applicationEnvironmentId: applicationEnvironmentId};
    let url = this.getUrl("/environments/@{applicationEnvironmentId}/logs/search", urlParams);
    return this.handleResult<MultipleDataResult<PaaSDeploymentLog>>(this.http.post(url, searchLogRequest));
  }

}

export class SearchLogRequest extends BasicSearchRequest {
  fromDate: number;
  toDate: number;
  sortConfiguration: SortConfiguration;
  filters: Map<string, string[]>;
}
