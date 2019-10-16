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


  getApplicationEnvironmentOverview(applicationId : string , environmentId : string ) : Observable<ApplicationOverview> {
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    let url = this.getUrl("/@{applicationId}/@{environmentId}", urlParams);
    return this.handleResult<ApplicationOverview>(this.http.get(url));
  } 
}
