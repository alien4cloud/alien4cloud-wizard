import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Application, ApplicationsService } from "@app/core";
import { PageEvent } from '@angular/material/paginator';
import { Subject, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']
})
export class ApplicationListComponent implements OnInit {

  constructor(
    private applicationsService: ApplicationsService
  ) { }

  public applications: Application[];

  // Paginator config
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  query = null;

  // MatPaginator Output
  pageEvent: PageEvent;

  // a form control to bind to serch input
  searchField: FormControl = new FormControl();

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
    this.applicationsService.getApplications(from, this.pageSize, this.query).subscribe((data: {}) => {
      this.applications = data['data']['data'] as Application[];
      this.length = data['data']['totalResults'];
    })
  }

  /**
   * This is trigerred when something is changed about pagination options.
   */
  private handlePage(e: any) {
    this.pageSize = e.pageSize;
    this.loadApplications(e.pageIndex);
  }

  private openDetails(applicationId: string) {
    // TODO: query plugin endpoint to retrieve details
    console.log("Openning ", applicationId);
  }

}
