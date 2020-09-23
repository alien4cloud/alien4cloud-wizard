import {Inject, Injectable} from '@angular/core';
import {
  BasicSearchRequest,
  FacetedSearchResult,
  PaaSDeploymentLog, SortConfiguration
} from "@app/core/models";
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "@alien4cloud/wizard4cloud-commons";
import {GenericResourceService} from "@app/core/services/generic-resource.service";

@Injectable({
  providedIn: 'root'
})
export class ApplicationLogService extends GenericResourceService<PaaSDeploymentLog> {

  constructor(
    http: HttpClient,
    translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings
  ) {
    super(http, translate, bootstrapSettings, "/applications/@{applicationId}")
  }

  searchEnvironmentLogs(applicationId: string, applicationEnvironmentId: string, searchLogRequest: SearchLogRequest): Observable<FacetedSearchResult<PaaSDeploymentLog>> {
    let urlParams = {applicationId: applicationId, applicationEnvironmentId: applicationEnvironmentId};
    let url = this.getUrl("/environments/@{applicationEnvironmentId}/logs/search", urlParams);
    return this.handleResult<FacetedSearchResult<PaaSDeploymentLog>>(this.http.post(url, searchLogRequest));
  }

}

export class SearchLogRequest extends BasicSearchRequest {
  fromDate: number;
  toDate: number;
  sortConfiguration: SortConfiguration;
  filters: Map<string, string[]>;
}
