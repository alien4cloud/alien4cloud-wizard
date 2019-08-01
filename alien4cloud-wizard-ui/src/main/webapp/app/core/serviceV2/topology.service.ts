import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Topology} from "@app/core";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from 'rxjs';
import {GenericResourceService} from "@app/core/serviceV2/generic-resource.service";


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
    translate: TranslateService
  ) {
    super(http, translate, "/catalog/topologies")
  }

}
