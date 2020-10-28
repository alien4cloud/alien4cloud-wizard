import {Component, Inject, OnInit} from '@angular/core';
import {mergeMap} from 'rxjs/operators';
import * as _ from 'lodash';
import {
  Application,
  ApplicationOverview,
  ApplicationEnvironmentDTO, FacetedSearchFacet, FilteredSearchRequest
} from "@app/core/models";
import {Router} from "@angular/router";
import {WebsocketSubscriptionManager} from "@app/core/services/websocket-subscription-manager.service";
import {ReplaySubject, Subscription} from "rxjs";
import {ToscaTypeShortNamePipe} from "@app/shared";
import {ApplicationEnvironmentService, ApplicationOverviewService, ApplicationService} from "@app/core/services";
import {BOOTSTRAP_SETTINGS, BootstrapSettings, ConfirmationDialogComponent, PaginatorConfig} from "@alien4cloud/wizard4cloud-commons";
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";

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
    private toscaTypeShortNamePipe: ToscaTypeShortNamePipe,
    private translate: TranslateService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    @Inject(BOOTSTRAP_SETTINGS) private bootstrapSettings: BootstrapSettings
  ) {
  }

  // make lodash usable from template
  private lodash = _;

  applications: Application[];
  overview: ApplicationOverview;

  applicationEnvironments: Map<string, ApplicationEnvironmentDTO[]>;

  // Paginator config
  paginatorConfig: PaginatorConfig = new PaginatorConfig();

  // indicates data loading
  private isLoadingSubject = new ReplaySubject<boolean>(1);
  isLoading$ = this.isLoadingSubject.asObservable();

  private facetsSubject = new ReplaySubject<Map<string, FacetedSearchFacet[]>>(1);
  facets$ = this.facetsSubject.asObservable();

  private statusMonitorEventSubscription: Subscription;

  private request: FilteredSearchRequest = new FilteredSearchRequest();

  private selectedEnvironmentId: string ;

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
    return this.bootstrapSettings.urlPrefix + `../img?id=${application.imageId}&quality=QUALITY_64`
  }

  searchApplications(request: FilteredSearchRequest) {
    this.request = request;
    this.loadApplications(0);
  }

  private loadApplications(from: number) {
    this.isLoadingSubject.next(true);
    let request = this.request;
    request.from = from;
    request.size = this.paginatorConfig.pageSize;
    this.applicationService.search(request)
      .pipe(
      mergeMap(data => {
        this.applications = data.data;
        this.paginatorConfig.length = data.totalResults;
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
   * This is triggered when something is changed about pagination options.
   */
  handlePage(e: any) {
    this.paginatorConfig.handlePaginatorEvent(e);
    this.loadApplications(this.paginatorConfig.getStart());
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
      this.selectedEnvironmentId = this.overview.applicationEnvironment.id;
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
      this.selectedEnvironmentId = this.overview.applicationEnvironment.id;
    });
  }


  deleteEnv() {
    const title = this.translate.instant("Global.Dialog.DeleteEnv.Title");
    const appEns: ApplicationEnvironmentDTO[] = this.applicationEnvironments[this.overview.application.id];
    const appEnvIdx = appEns.findIndex(value => value.id == this.selectedEnvironmentId);
    const msg = this.translate.instant("Global.Dialog.DeleteEnv.Message", {environmentName: appEns[appEnvIdx].name, applicationName: this.overview.application.name});
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '35%',
      data: {
        actionDescription: title,
        message: msg
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.applicationEnvironmentService.deleteApplicationEnvironment(this.overview.application.id, this.selectedEnvironmentId).subscribe(value => {
          if (value) {
            const appEns: ApplicationEnvironmentDTO[] = this.applicationEnvironments[this.overview.application.id];
            const filteredAppEns: ApplicationEnvironmentDTO[] = appEns.splice(appEnvIdx, 1);
            this.selectedEnvironmentId = filteredAppEns[0].id;
            this.applicationEnvironments[this.overview.application.id] = filteredAppEns;
          }
        }, error => {
          this.toastr.error(title, error.message);
        });
      }
    });
  }

  deleteApp() {
    const title = this.translate.instant("Wizard.Forms.DeleteApplicationFormComponent.DeleteDialog.Title");
    const msg = this.translate.instant("Wizard.Forms.DeleteApplicationFormComponent.DeleteDialog.Message", {applicationName: this.overview.application.name});
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '35%',
      data: {
        actionDescription: title,
        message: msg
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.applicationService.delete(this.overview.application.id).subscribe(value => {
          this.applications = this.applications.filter(value1 => value1.id != this.overview.application.id);
        }, error => {
          this.toastr.error(title, error.message);
        });
      }
    });
  }
}
