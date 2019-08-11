import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {PageEvent} from '@angular/material/paginator';
import {debounceTime} from 'rxjs/operators';
import * as _ from 'lodash';

import {Application, ApplicationOverview, ApplicationOverviewService, ApplicationService, ApplicationEnvironmentService, ApplicationEnvironmentDTO} from "@app/core";
import {Router} from "@angular/router";
import {WebsocketSubscriptionManager} from "@app/core/services/websocket-subscription-manager.service";
import {PaaSDeploymentStatusMonitorEvent} from "@app/core/models/monitor-event.model";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit {

  constructor(
    private applicationService: ApplicationService,
    private applicationOverviewService: ApplicationOverviewService,
    private applicationEnvironmentService: ApplicationEnvironmentService,
    private router: Router,
    private websocketService: WebsocketSubscriptionManager
  ) {
  }

  // make lodash usable from template
  private lodash = _;

  private applications: Application[];
  private overview: ApplicationOverview;
  private applicationEnvironments: ApplicationEnvironmentDTO[];
  private applicationIds: Array<String> = [];


  // Paginator config
  private length = 100;
  private pageSize = 10;
  private pageSizeOptions: number[] = [5, 10, 25, 100];
  private query = null;
  private pageIndex = 0;

  // MatPaginator Output
  private pageEvent: PageEvent;

  // a form control to bind to search input
  private searchField: FormControl = new FormControl();

  // indicates data loading
  private isLoading: boolean = false;

  private statusMonitorEventSubscription: Subscription;

  ngOnInit() {
    this.loadApplications(0);

    // add a debounceTimed suscription to avoid bakend mass attack
    this.searchField.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(term => {
        this.query = term;
        this.pageIndex = 0;
        this.loadApplications(0);
      });
  }


  private loadApplications(from: number) {
    this.isLoading = true;
    this.applicationService.search(from, this.pageSize, this.query).subscribe((data) => {
      this.applications = data.data;
      this.length = data.totalResults;
      this.getApplicationEnvironments();
      this.isLoading = false;
    });
  }

  /**
   * This is trigerred when something is changed about pagination options.
   */
  private handlePage(e: any) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadApplications(this.pageSize * e.pageIndex);
  }

  /**
   * Trigered when the panel is expanded.
   */
  private openDetails(applicationId: string) {
    console.log("Openning ", applicationId);
    this.overview = undefined;
    this.applicationOverviewService.getById(applicationId).subscribe((data) => {
      // FIXME; TODO unsuscribe
       this.statusMonitorEventSubscription = this.websocketService.registerEnvironmentStatusChannel(data.applicationEnvironment.id).subscribe(e => {
        console.log("DeploymentStatus has changed : ", e.deploymentStatus);
        this.overview.deploymentStatus = e.deploymentStatus;
      });
      this.overview = data;
    });
  }

  closeDetails() {
    this.statusMonitorEventSubscription.unsubscribe();
  }

  private openWizard() {
    let routeUrl = `/app-wizard/${this.overview.application.id}/${this.overview.applicationEnvironment.id}`;
    console.log("Routing to :", routeUrl)
    this.router.navigateByUrl(routeUrl);
  }

  private getApplicationEnvironments() {
    this.applications.map(item => this.applicationIds.push(item.id));
    this.applicationEnvironmentService.getEnvironmentApplications(this.applicationIds).subscribe((data) => {
      this.applicationEnvironments = data;
    });
  }
}
