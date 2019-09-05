import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {GenericResourceService} from './generic-resource.service';
import {BasicSearchRequest, NodeType} from '../models';

@Injectable({
  providedIn: 'root'
})
export class CatalogService extends GenericResourceService<NodeType> {
  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/wizard/components")
  }
}

export class ComponentSearchRequest extends BasicSearchRequest {
  filters?: any;
  type: QueryComponentType;
}

export enum QueryComponentType {
  NODE_TYPE = "NODE_TYPE", CAPABILITY_TYPE = "CAPABILITY_TYPE", RELATIONSHIP_TYPE="RELATIONSHIP_TYPE", ARTIFACT_TYPE="ARTIFACT_TYPE", POLICY_TYPE="POLICY_TYPE"
}
