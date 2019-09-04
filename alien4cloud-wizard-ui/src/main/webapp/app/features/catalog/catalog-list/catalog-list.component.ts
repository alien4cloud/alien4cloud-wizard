import { Component, OnInit } from '@angular/core';
import { FormControl} from '@angular/forms';
import { NodeType } from '@app/core';
import { CatalogService } from '@app/core/services/catalog.service';
import {debounceTime} from "rxjs/operators";


@Component({
  selector: 'w4c-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.scss']
})
export class CatalogListComponent implements OnInit {

  // a form control to bind to search input
  searchField: FormControl = new FormControl();

  // indicates data loading
  isLoading: boolean = false;
  // make lodash usable from template

  type = "NODE_TYPE";
  query = null;

  catalogs: NodeType[];

  globalContext = '=';

  constructor(
    private catalogService: CatalogService
  ) { }

  ngOnInit() {
    this.loadCatalog();
    // add a debounceTimed suscription to avoid bakend mass attack
    this.searchField.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(term => {
        this.query = term;
        this.loadCatalog();
      });
  }
  

  private loadCatalog() {
    this.isLoading = true;
    this.catalogService.facetedSearch(0, 200, this.query, this.type).subscribe((data) => {
      this.catalogs = data.data;
      console.log("catalog : " + JSON.stringify(this.catalogs[0].archiveName));
      //this.length = data.totalResults;
      this.isLoading = false;
    })
  }
}
