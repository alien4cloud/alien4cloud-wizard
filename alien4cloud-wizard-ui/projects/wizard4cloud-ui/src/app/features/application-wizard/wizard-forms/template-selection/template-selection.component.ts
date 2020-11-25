import {Component, Input, OnInit} from '@angular/core';
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {DoSelectTemplate} from "@app/features/application-wizard/core/fsm.events";

import * as _ from "lodash";
import {WizardFormComponent} from "@app/features/application-wizard/core/wizard.model";
import {ReplaySubject, Subscription} from "rxjs";
import {FacetedSearchFacet, FilteredSearchRequest, Topology, TopologyOverview} from "@app/core/models";
import {TopologyOverviewService, TopologyService} from "@app/core/services";
import {CatalogVersionResult} from "@app/core/models/catalog.model";
import {PaginatorConfig} from "@alien4cloud/wizard4cloud-commons";

@Component({
  selector: 'w4c-template-selection',
  templateUrl: './template-selection.component.html',
  styleUrls: ['./template-selection.component.css']
})
export class TemplateSelectionComponent extends WizardFormComponent implements OnInit {

  // make lodash usable from template
  lodash = _;

  // Paginator config
  paginatorConfig: PaginatorConfig = new PaginatorConfig();

  // indicates data loading
  private isLoadingSubject = new ReplaySubject<boolean>(1);
  isLoading$ = this.isLoadingSubject.asObservable();

  private facetsSubject = new ReplaySubject<Map<string, FacetedSearchFacet[]>>(1);
  facets$ = this.facetsSubject.asObservable();

  private request: FilteredSearchRequest = new FilteredSearchRequest();

  public topologyTemplates: Topology[];
  private topologyTemplatesBackendData: Topology[];
  overview: TopologyOverview;
  versions: CatalogVersionResult[];
  // the selected topology id
  selected: string;

  constructor(
    protected fsm: AppplicationWizardMachineService,
    private topologyService: TopologyService,
    private topologyOverviewService: TopologyOverviewService
  ) { super(fsm); }

  ngOnInit() {
    this.loadTopologies();
  }

  searchTopologies(request: FilteredSearchRequest) {
    this.request = request;
    this.loadTopologies();
  }

  private loadTopologies() {
    this.isLoadingSubject.next(true);
    this.request.size = 10000;
    this.topologyService.search(this.request).subscribe((data) => {
      this.paginatorConfig.pageIndex = 0;
      this.paginatorConfig.length = data.totalResults;
      this.topologyTemplatesBackendData = data.data;
      this.selectDataFromPagination();
      this.facetsSubject.next(data.facets);
      this.isLoadingSubject.next(false);
    })
  }

  private selectDataFromPagination() {
    this.topologyTemplates = this.topologyTemplatesBackendData.slice(this.paginatorConfig.getStart(), this.paginatorConfig.getEnd());
  }

  /**
   * Trigered when the panel is expanded.
   */
  openDetails(topologyId: string) {
    // TODO: query plugin endpoint to retrieve details
    console.log("Openning ", topologyId);
    this.selected = topologyId;
    this.loadTopology(topologyId);
  }

  selectTemplate() {
    console.log(`Selected template: id=${this.overview.topologyDTO.topology.id}`);
    this.fsm.send(new DoSelectTemplate(this.overview.topologyDTO.topology));
  }

  private loadTopology(topologyId: string) {
    this.overview = undefined;
    this.versions = [];
    this.topologyOverviewService.getById(topologyId).subscribe(data => {
      this.overview = data;
      this.topologyService.getVersions(data.topologyDTO.topology.archiveName).subscribe(data => {
        this.versions = data;
      });
    });
  }

  onTopologyVersionSelection(selected: string) {
    this.loadTopology(selected);
  }

  /**
   * This is triggered when something is changed about pagination options.
   */
  handlePage(e: any) {
    this.paginatorConfig.handlePaginatorEvent(e);
    this.selectDataFromPagination();
  }

}
