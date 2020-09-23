import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  FacetedSearchFacet,
  FilteredSearchRequest,
  FilterGroupItem,
  FilterValueItem
} from "@app/core/models";
import {Observable, ReplaySubject} from "rxjs";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {MatAutocompleteSelectedEvent} from "@angular/material";
import * as _ from "lodash";
import {ToscaTypeShortNamePipe} from "@app/shared/pipes";

@Component({
  selector: 'w4c-filtered-search-bar',
  templateUrl: './filtered-search-bar.component.html',
  styleUrls: ['./filtered-search-bar.component.css']
})
export class FilteredSearchBarComponent implements OnInit {

  @Input()
  isLoading$: Observable<boolean>;

  @Input()
  facets$: Observable<Map<string, FacetedSearchFacet[]>>;

  @Output()
  onSearch: EventEmitter<FilteredSearchRequest> = new EventEmitter<FilteredSearchRequest>();

  constructor(
    private toscaTypeShortNamePipe: ToscaTypeShortNamePipe
  ) {}

  // a form control to bind to search input
  searchField: FormControl = new FormControl();

  filterItems: FilterGroupItem[];
  // filteredFilters: Observable<FilterGroupItem[]>;
  activeFilters: FilterValueItem[] = [];

  private filteredFiltersSubject = new ReplaySubject<FilterGroupItem[]>(1);
  filteredFilters$ = this.filteredFiltersSubject.asObservable();

  // indicates data loading
  isLoading: boolean = false;

  ngOnInit() {
    this.searchField.valueChanges
      .pipe(debounceTime(500))
      .subscribe(term => {
        let lowerTerm = term.toString().toLowerCase();
        let filtered: FilterGroupItem[] = [];
        if (term == "") {
          this.filteredFiltersSubject.next(filtered);
        } else {
          this.filterItems.forEach(value => {
            if (value.displayName.toLowerCase().includes(lowerTerm)) {
              filtered.push(value);
            } else {
              let founds: FilterValueItem[] = [];
              value.valueItems.forEach(item => {
                if (item.displayName.toLowerCase().includes(lowerTerm)) {
                  founds.push(item);
                }
              });
              if (founds.length > 0) {
                let group: FilterGroupItem = {displayName: value.displayName, valueItems: founds};
                filtered.push(group);
              }
            }
          });
          this.filteredFiltersSubject.next(filtered);
        }
      });
    this.facets$.subscribe(value => {
      this.setFilters(value);
    });
    this.isLoading$.subscribe(value => { this.isLoading = value; });
  }

  private setFilters(facets: Map<string, FacetedSearchFacet[]>) {
    console.log("Set facets : ", JSON.stringify(facets));
    let filterItems: FilterGroupItem[] = [];
    if (facets != undefined) {
      for (const [facetName, facetValues] of Object.entries(facets)) {
        let shortFilterName = this.toscaTypeShortNamePipe.transform(facetName);
        let item: FilterGroupItem = {displayName: shortFilterName, valueItems: []};
        (<FacetedSearchFacet[]>facetValues).forEach(value => {
          let displayValue = (_.isEmpty(value.facetValue)) ? "N/A" : value.facetValue;
          let leaf: FilterValueItem = {displayName: displayValue, filterName: facetName, count: value.count, filterDisplayName: shortFilterName, value: value.facetValue};
          item.valueItems.push(leaf);
        });
        filterItems.push(item);
      }
    }
    this.filterItems = filterItems;
  }

  filterSelected(event: MatAutocompleteSelectedEvent) {
    console.log("Option selected : ", JSON.stringify(event.option.value));
    this.searchField.setValue("");
    let filterValue = <FilterValueItem>event.option.value;
    let group =  _.find(this.activeFilters, i => { i.filterName == filterValue.filterName});
    //_.findIndex((<FilterGroupItem>group).valueItems, i => { i.value == filterValue.value });

    this.activeFilters.push(filterValue);
    setTimeout( () => this.search(), 400);
  }

  removeFilter(filter: FilterValueItem) {
    console.log("Remove filter #", JSON.stringify(filter));
    console.log(this.activeFilters.length );
    _.remove(this.activeFilters, n => n.filterName == filter.filterName && n.value == filter.value);
    // this.activeFilters = this.activeFilters.splice(i + 1, 1);
    console.log(this.activeFilters.length);
    this.search();
  }

  onEnter() {
    let filterItems: FilterGroupItem[] = [];
    this.filteredFiltersSubject.next(filterItems);
    this.search();
  }

  search() {
    let request = new FilteredSearchRequest();
    request.query = this.searchField.value;
    let filterValuesMap: any = {};
    this.activeFilters.forEach(filter => {
      filterValuesMap[filter.filterName] = [filter.displayName];
    })
    request.filters = filterValuesMap;
    this.onSearch.emit(request);
  }

}
