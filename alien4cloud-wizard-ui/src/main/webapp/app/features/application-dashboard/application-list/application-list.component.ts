import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as _ from 'lodash';



import { Application, ApplicationsService, ApplicationOverview, MetaProperty, ApplicationModule } from "@app/core";

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit {

  constructor(
    private applicationsService: ApplicationsService
  ) { }

  // make lodash usable from template
  private lodash = _;

  private applications: Application[];
  private overview: ApplicationOverview;

  // Paginator config
  private length = 100;
  private pageSize = 10;
  private pageSizeOptions: number[] = [5, 10, 25, 100];
  private query = null;

  // MatPaginator Output
  private pageEvent: PageEvent;

  // a form control to bind to search input
  private searchField: FormControl = new FormControl();

  // indicates data loading
  private isLoading: boolean = false;

  ngOnInit() {
    this.loadApplications(0);

    // add a debounceTimed suscription to avoid bakend mass attack
    this.searchField.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(term => {
        this.query = term;
        this.loadApplications(0);
    });
  }

  private loadApplications(from: number) {
    this.isLoading = true;
    this.applicationsService.getApplications(from, this.pageSize, this.query).subscribe((data: {}) => {
      this.applications = data['data']['data'] as Application[];
      this.length = data['data']['totalResults'];
      this.isLoading = false;
    });
  }

  /**
   * This is trigerred when something is changed about pagination options.
   */
  private handlePage(e: any) {
    this.pageSize = e.pageSize;
    this.loadApplications(e.pageIndex);
  }

  /**
   * Trigered when the panel is expanded.
   */
  private openDetails(applicationId: string) {
    // TODO: query plugin endpoint to retrieve details
    console.log("Openning ", applicationId);
    this.overview = undefined;
    this.applicationsService.getApplicationOverview(applicationId).subscribe((data: {}) => {
      this.overview = data['data'] as ApplicationOverview;
    });
  }

}
