import {Component, Input, OnInit} from '@angular/core';
import {AppplicationWizardMachineService} from "@app/features/application-wizard/fsm/application-wizard-machine.service";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/fsm/application-wizard-machine.model";
import {DoSelectTemplate} from "@app/features/application-wizard/fsm/application-wizard-machine.events";
import {PageEvent} from "@angular/material";
import {FormControl} from "@angular/forms";
import {TopologyTemplate, TopologyTemplateService} from "@app/core";
import {debounceTime} from "rxjs/operators";
import * as _ from "lodash";
import {WizardFromComponent} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.model";

@Component({
  selector: 'w4c-template-selection',
  templateUrl: './template-selection.component.html',
  styleUrls: ['./template-selection.component.css']
})
export class TemplateSelectionComponent implements OnInit, WizardFromComponent {

  // make lodash usable from template
  private lodash = _;

  // indicates data loading
  isLoading: boolean = false;

  // Paginator config
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  query = null;

  // MatPaginator Output
  pageEvent: PageEvent;

  // a form control to bind to search input
  searchField: FormControl = new FormControl();


  public topologyTemplates: TopologyTemplate[];

  constructor(
    private fsm: AppplicationWizardMachineService,
    private topologyTemplateService: TopologyTemplateService
  ) { }

  @Input() fsmContext: ApplicationWizardMachineContext;

  ngOnInit() {
    if (this.fsmContext) {
      // this.templateId = this.fsmContext.templateId;
      // TODO: here display the selected topology
    }

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
      this.topologyTemplates = data['data']['data'] as TopologyTemplate[];
      this.length = data['data']['totalResults'];
      this.isLoading = false;
    })
  }

  /**
   * This is trigerred when something is changed about pagination options.
   */
  private handlePage(e: any) {
    this.pageSize = e.pageSize;
    this.loadTopologies(e.pageIndex * e.pageSize);
  }

  /**
   * Trigered when the panel is expanded.
   */
  private openDetails(topologyId: string) {
    // TODO: query plugin endpoint to retrieve details
    console.log("Openning ", topologyId);
    // this.overview = undefined;
    // this.applicationsService.getApplicationOverview(applicationId).subscribe((data: {}) => {
    //   this.overview = data['data'] as ApplicationOverview;
    // });
  }

  selectTemplate(topologyId: string) {
    console.log(`Selected template: id=${topologyId}`);
    this.fsm.send(new DoSelectTemplate(topologyId));
  }

}
