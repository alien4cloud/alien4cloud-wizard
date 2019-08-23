import {Component, Input, OnInit} from '@angular/core';
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {DoSelectTemplate} from "@app/features/application-wizard/core/fsm.events";
import {PageEvent} from "@angular/material";
import {FormControl} from "@angular/forms";
import {TopologyOverview, Topology, TopologyService, TopologyOverviewService} from "@app/core";
import {debounceTime} from "rxjs/operators";
import * as _ from "lodash";
import {WizardFormComponent} from "@app/features/application-wizard/core/wizard.model";

@Component({
  selector: 'w4c-template-selection',
  templateUrl: './template-selection.component.html',
  styleUrls: ['./template-selection.component.css']
})
export class TemplateSelectionComponent extends WizardFormComponent implements OnInit {

  // make lodash usable from template
  lodash = _;

  // indicates data loading
  isLoading: boolean = false;

  query = null;

  // a form control to bind to search input
  searchField: FormControl = new FormControl();

  public topologyTemplates: Topology[];
  overview: TopologyOverview;

  constructor(
    protected fsm: AppplicationWizardMachineService,
    private topologyService: TopologyService,
    private topologyOverviewService: TopologyOverviewService
  ) { super(fsm); }

  ngOnInit() {

    this.loadTopologies();
    // add a debounceTimed suscription to avoid bakend mass attack
    this.searchField.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(term => {
        this.query = term;
        this.loadTopologies();
      });
  }

  private loadTopologies() {
    this.isLoading = true;
    this.topologyService.search(0, 10000, this.query).subscribe((data) => {
      this.topologyTemplates = data.data;
      //this.length = data.totalResults;
      this.isLoading = false;
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
