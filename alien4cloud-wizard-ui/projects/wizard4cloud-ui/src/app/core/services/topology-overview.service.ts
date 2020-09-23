import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from "@ngx-translate/core";
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "@alien4cloud/wizard4cloud-commons";
import {GenericResourceService} from "@app/core/services/generic-resource.service";
import {TopologyOverview} from "@app/core/models";


@Injectable({
  providedIn: 'root'
})
export class TopologyOverviewService extends GenericResourceService<TopologyOverview> {

  constructor(
    http: HttpClient,
    translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings
  ) {
    super(http, translate, bootstrapSettings, "/wizard/topologies/overview")
  }

}
