import {Component, OnInit} from '@angular/core';
import {mergeMap} from 'rxjs/operators';
import * as _ from 'lodash';
import {
  Application,
  ApplicationOverview,
  ApplicationOverviewService,
  ApplicationService,
  ApplicationEnvironmentService,
  ApplicationEnvironmentDTO,
  FacetedSearchFacet, FilteredSearchRequest
} from "@app/core";
import {Router} from "@angular/router";
import {WebsocketSubscriptionManager} from "@app/core/services/websocket-subscription-manager.service";
import {ReplaySubject, Subscription} from "rxjs";
import {environment} from '../../../../environments/environment';
import {ToscaTypeShortNamePipe} from "@app/shared";

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
    private websocketService: WebsocketSubscriptionManager,
    private toscaTypeShortNamePipe: ToscaTypeShortNamePipe
  ) {
  }

  // make lodash usable from template
  private lodash = _;

  applications: Application[];
  overview: ApplicationOverview;

  applicationEnvironments: Map<string, ApplicationEnvironmentDTO[]>;

  // Paginator config
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  // query = null;
  pageIndex = 0;

  // indicates data loading
  private isLoadingSubject = new ReplaySubject<boolean>(1);
  isLoading$ = this.isLoadingSubject.asObservable();

  private facetsSubject = new ReplaySubject<Map<string, FacetedSearchFacet[]>>(1);
  facets$ = this.facetsSubject.asObservable();

  private statusMonitorEventSubscription: Subscription;

  private request: FilteredSearchRequest = new FilteredSearchRequest();

  private selected : string ;

  ngOnInit() {
    this.loadApplications(0);

    this.websocketService.deployementStatusChange.subscribe(e => {
      console.log(`Status changed to ${e.status} for deployment ${e.environmentId}`);
      // TODO: here a good lodash filter + take should do the job more efficiently
      // FIXME : why can't we iterate over objects ? do we have a map deserialization issue ?
      if (this.applicationEnvironments) {
        Object.entries(this.applicationEnvironments).forEach(([appName, envs]) => {
          _.forEach(envs, env => {
            if (env["id"] === e.environmentId) {
              env["status"] = e.status;
            }
          });
        });
      }
    });
  }

  getApplicationImageUrl(application: Application) {
    return environment.urlPrefix + `../img?id=${application.imageId}&quality=QUALITY_64`
  }

  searchApplications(request: FilteredSearchRequest) {
    this.request = request;
    this.loadApplications(0);
  }

  private loadApplications(from: number) {
    this.isLoadingSubject.next(true);
    let request = this.request;
    request.from = from;
    request.size = this.pageSize;
    this.applicationService.search(request)
      .pipe(
      mergeMap(data => {
        this.applications = data.data;
        this.length = data.totalResults;
        this.facetsSubject.next(data.facets);
        let applicationIds: string[] = this.applications.map(application => application.id);
        console.log("Applications IDs array length ", applicationIds.length);
        this.isLoadingSubject.next(false);
        return this.applicationEnvironmentService.getEnvironmentApplications(applicationIds)
      })
      ).subscribe((data) => {
        console.log("Received environments data: ", JSON.stringify(data))
        this.applicationEnvironments = data;
      }
    );
  }

  /**
   * This is trigerred when something is changed about pagination options.
   */
  handlePage(e: any) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadApplications(this.pageSize * e.pageIndex);
  }

  /**
   * Trigered when the panel is expanded.
   */
  openDetails(applicationId: string) {
    console.log("Openning ", applicationId);
    this.overview = undefined;
    this.applicationOverviewService.getById(applicationId).subscribe((data) => {
      // FIXME; TODO unsuscribe
       this.statusMonitorEventSubscription = this.websocketService.registerEnvironmentStatusChannel(data.applicationEnvironment.id).subscribe(e => {
        console.log("DeploymentStatus has changed : ", e.deploymentStatus);
        this.overview.deploymentStatus = e.deploymentStatus;
      });
      this.overview = data;
      
      //dislpay Default Environment in input of selection
      this.selected = this.overview.applicationEnvironment.id;
    });
  }

  closeDetails() {
    this.statusMonitorEventSubscription.unsubscribe();
  }

  openWizard() {
    let routeUrl = `/app-wizard/${this.overview.application.id}/${this.overview.applicationEnvironment.id}`;
    console.log("Routing to :", routeUrl)
    this.router.navigateByUrl(routeUrl);
  }

  onApplicationEnvironmentSelection(applicationId : string , environmentId : string){
    this.applicationOverviewService.getApplicationEnvironmentOverview(applicationId,environmentId).subscribe((data) => {
      //update overview
      this.overview = data;
      //Display Environment selected in input of selection :
      this.selected = this.overview.applicationEnvironment.id;
    });
  }
  

}
