import {Component, OnInit} from '@angular/core';
import {
  FacetedSearchFacet, FilteredSearchRequest,
  NodeType
} from '@app/core/models';
import {CatalogService, ComponentSearchRequest, QueryComponentType} from '@app/core/services/catalog.service';
import {ReplaySubject} from "rxjs";
import * as _ from 'lodash';
import {MetaPropertiesService} from "@app/core/services";
import {MetaPropConfiguration, PaginatorConfig} from "@alien4cloud/wizard4cloud-commons";

@Component({
  selector: 'w4c-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.scss']
})
export class CatalogListComponent implements OnInit {

  private request: ComponentSearchRequest = new ComponentSearchRequest();

  // make lodash usable from template
  private lodash = _;

  // indicates data loading
  private isLoadingSubject = new ReplaySubject<boolean>(1);
  isLoading$ = this.isLoadingSubject.asObservable();

  private facetsSubject = new ReplaySubject<Map<string, FacetedSearchFacet[]>>(1);
  facets$ = this.facetsSubject.asObservable();

  metaPropConfiguration: Map<string, MetaPropConfiguration> = new Map();

  catalogs: NodeType[];
  catalogData: NodeType[];

  // Paginator config
  paginatorConfig: PaginatorConfig = new PaginatorConfig();

  constructor(
    private catalogService: CatalogService,
    private metaPropertiesService: MetaPropertiesService
  ) { }

  ngOnInit() {
    this.metaPropertiesService.search({from: 0, size: 1000, query: "", filters: {"target":["component"]}})
      .subscribe(
        metaprops => {
          if (metaprops.totalResults > 0) {
            metaprops.data.forEach(value => {
              this.metaPropConfiguration.set(value.id, value);
            });
          }
        }
      )
    this.searchInCatalog(new FilteredSearchRequest());
  }

  searchInCatalog(request: FilteredSearchRequest) {
    this.request.filters = request.filters;
    this.request.type = QueryComponentType.NODE_TYPE;
    this.request.query = request.query;
    this.loadCatalog();
  }

  private loadCatalog() {
    this.isLoadingSubject.next(true);
    this.catalogService.search(this.request).subscribe((data) => {
      this.catalogData = data.data;
      this.paginatorConfig.pageIndex = 0;
      this.paginatorConfig.length = this.catalogData.length;
      this.pageCatalog();
      this.facetsSubject.next(data.facets);
      this.isLoadingSubject.next(false);
    })
  }

  private pageCatalog() {
    this.catalogs = this.catalogData.slice(this.paginatorConfig.getStart(), this.paginatorConfig.getEnd());
  }

  /**
   * This is triggered when something is changed about pagination options.
   */
  handlePaginator(e: any) {
    this.paginatorConfig.handlePaginatorEvent(e);
    this.pageCatalog();
  }

}
