import {Component, Input, OnInit} from '@angular/core';
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {DoSelectTemplate} from "@app/features/application-wizard/core/fsm.events";
import {PageEvent} from "@angular/material";
import {FormControl} from "@angular/forms";
import {
  TopologyOverview,
  Topology,
  TopologyService,
  TopologyOverviewService,
  FacetedSearchFacet,
  FilteredSearchRequest
} from "@app/core";
import {debounceTime} from "rxjs/operators";
import * as _ from "lodash";
import {WizardFormComponent} from "@app/features/application-wizard/core/wizard.model";
import {ReplaySubject, Subscription} from "rxjs";

@Component({
  selector: 'w4c-template-selection',
  templateUrl: './template-selection.component.html',
  styleUrls: ['./template-selection.component.css']
})
export class TemplateSelectionComponent extends WizardFormComponent implements OnInit {

  // make lodash usable from template
  lodash = _;

  // indicates data loading
  private isLoadingSubject = new ReplaySubject<boolean>(1);
  isLoading$ = this.isLoadingSubject.asObservable();

  private facetsSubject = new ReplaySubject<Map<string, FacetedSearchFacet[]>>(1);
  facets$ = this.facetsSubject.asObservable();

  private request: FilteredSearchRequest = new FilteredSearchRequest();

  public topologyTemplates: Topology[];
  overview: TopologyOverview;

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
    this.topologyService.search(this.request).subscribe((data) => {
      this.topologyTemplates = data.data;
      this.facetsSubject.next(data.facets);
      this.isLoadingSubject.next(false);
    })
  }

  /**
   * Trigered when the panel is expanded.
   */
  openDetails(topologyId: string) {
    // TODO: query plugin endpoint to retrieve details
    console.log("Openning ", topologyId);
    this.overview = undefined;
    this.topologyOverviewService.getById(topologyId).subscribe(data => {
      this.overview = data;
    });
  }

  selectTemplate(topology: Topology) {
    console.log(`Selected template: id=${topology.id}`);
    this.fsm.send(new DoSelectTemplate(topology));
  }

}
