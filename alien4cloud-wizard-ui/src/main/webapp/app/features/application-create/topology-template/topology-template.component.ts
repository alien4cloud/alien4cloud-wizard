import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subject, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { TopologyTemplateService } from '@app/core/services/topology-template.service';
import { TopologyTemplate } from '@app/core/models/topology-template.model';

@Component({
  selector: 'app-topology-template',
  templateUrl: './topology-template.component.html',
  styleUrls: ['./topology-template.component.css']
})
export class TopologyTemplateComponent implements OnInit {

  panelOpenState = false;


  public topologyTemplate: TopologyTemplate[];

  constructor(
    private topologyTemplateService: TopologyTemplateService
  ) { }


  // Paginator config
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  query = null;

  // MatPaginator Output
  pageEvent: PageEvent;

  // a form control to bind to serch input
  searchField: FormControl = new FormControl();

  // indicates data loading
  isLoading: boolean = false;

  ngOnInit() {
    this.loadTopologies(0);

    // add a debounceTimed suscription to avoid bakend mass attack
    this.searchField.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(term => {
        this.query = term;
        this.loadTopologies(0);
      });
  }

  private loadTopologies(from: number) {
    this.isLoading = true;
    this.topologyTemplateService.getTopologies(from, this.pageSize, this.query).subscribe((data: {}) => {
      this.topologyTemplate = data['data']['data'] as TopologyTemplate[];
      this.length = data['data']['totalResults'];
      this.isLoading = false;
    })
  }

  /**
   * This is trigerred when something is changed about pagination options.
   */
  private handlePage(e: any) {
    this.pageSize = e.pageSize;
    this.loadTopologies(e.pageIndex);
  }

  private openDetails(applicationId: string) {
    // TODO: query plugin endpoint to retrieve details
    this.panelOpenState = true ;
    console.log("Openning ", applicationId);
  }

  private closeDetails(applicationId: string) {
    // TODO: query plugin endpoint to retrieve details
    this.panelOpenState = false ;
    console.log("closing ", applicationId);
  }




}
