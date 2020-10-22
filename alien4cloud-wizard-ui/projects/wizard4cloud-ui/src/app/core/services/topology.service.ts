import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TranslateService} from "@ngx-translate/core";
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "@alien4cloud/wizard4cloud-commons";
import {GenericResourceService} from "@app/core/services/generic-resource.service";
import {Topology, TopologyDTO} from "@app/core/models";
import {Observable} from "rxjs";
import {CatalogVersionResult} from "@app/core/models/catalog.model";


export class AppCreationTopoPayload {
  name: string;
  archiveName: string;
  topologyTemplateVersionId: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class TopologyService extends GenericResourceService<Topology> {

  constructor(
    http: HttpClient,
    translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings
  ) {
    super(http, translate, bootstrapSettings, "/catalog/topologies")
  }

  getVersions(archiveName: string): Observable<CatalogVersionResult[]> {
    let urlParams = {archiveName: archiveName};
    const url = this.getUrl("/@{archiveName}/versions", urlParams);
    return this.handleResult<CatalogVersionResult[]>(this.http.get(url));
  }

}
