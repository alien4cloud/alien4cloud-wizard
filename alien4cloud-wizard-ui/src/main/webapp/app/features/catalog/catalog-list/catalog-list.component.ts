import { Component, OnInit } from '@angular/core';
import { FormControl} from '@angular/forms';
import {FacetedSearchFacet, FilteredSearchRequest, NodeType} from '@app/core';
import {CatalogService, ComponentSearchRequest, QueryComponentType} from '@app/core/services/catalog.service';
import {debounceTime} from "rxjs/operators";
import {ReplaySubject} from "rxjs";


@Component({
  selector: 'w4c-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.scss']
})
export class CatalogListComponent implements OnInit {

  private request: ComponentSearchRequest = new ComponentSearchRequest();

  // indicates data loading
  private isLoadingSubject = new ReplaySubject<boolean>(1);
  isLoading$ = this.isLoadingSubject.asObservable();

  private facetsSubject = new ReplaySubject<Map<string, FacetedSearchFacet[]>>(1);
  facets$ = this.facetsSubject.asObservable();

  catalogs: NodeType[];

  constructor(
    private catalogService: CatalogService
  ) { }

  ngOnInit() {
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
      this.catalogs = data.data;
      this.facetsSubject.next(data.facets);
      this.isLoadingSubject.next(false);
    })
  }
}
