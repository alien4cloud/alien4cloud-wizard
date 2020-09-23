import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "@alien4cloud/wizard4cloud-commons";
import {GenericResourceService} from "@app/core/services/generic-resource.service";
import {ApplicationOverview} from "@app/core/models";


@Injectable({
  providedIn: 'root'
})
export class ApplicationOverviewService extends GenericResourceService<ApplicationOverview> {

  constructor(
    http: HttpClient,
    translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings
  ) {
    super(http, translate, bootstrapSettings, "/wizard/applications/overview")
  }


  getApplicationEnvironmentOverview(applicationId : string , environmentId : string ) : Observable<ApplicationOverview> {
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    let url = this.getUrl("/@{applicationId}/@{environmentId}", urlParams);
    return this.handleResult<ApplicationOverview>(this.http.get(url));
  }
}
