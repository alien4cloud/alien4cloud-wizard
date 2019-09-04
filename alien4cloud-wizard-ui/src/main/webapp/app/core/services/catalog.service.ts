import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import { GenericResourceService } from './generic-resource.service';
import { FacetedSearchResult, NodeType } from '../models';

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
