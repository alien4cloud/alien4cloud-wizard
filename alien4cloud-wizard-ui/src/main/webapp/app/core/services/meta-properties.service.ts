import { Injectable } from '@angular/core';
import {DeploymentTopologyDTO, MetaPropConfiguration} from "@app/core";
import {GenericResourceService} from "./generic-resource.service";
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class MetaPropertiesService extends GenericResourceService<MetaPropConfiguration>  {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/metaproperties");
  }

}
