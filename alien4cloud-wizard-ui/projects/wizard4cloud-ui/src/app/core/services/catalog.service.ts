import {Inject, Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {BasicSearchRequest, NodeType} from '../models';
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "@alien4cloud/wizard4cloud-commons";
import {GenericResourceService} from "@app/core/services/generic-resource.service";

@Injectable({
  providedIn: 'root'
})
export class CatalogService extends GenericResourceService<NodeType> {
  constructor(
    http: HttpClient,
    translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings
  ) {
    super(http, translate, bootstrapSettings, "/wizard/components")
  }
}

export class ComponentSearchRequest extends BasicSearchRequest {
  filters?: any;
  type: QueryComponentType;
}

export enum QueryComponentType {
  NODE_TYPE = "NODE_TYPE", CAPABILITY_TYPE = "CAPABILITY_TYPE", RELATIONSHIP_TYPE="RELATIONSHIP_TYPE", ARTIFACT_TYPE="ARTIFACT_TYPE", POLICY_TYPE="POLICY_TYPE"
}
