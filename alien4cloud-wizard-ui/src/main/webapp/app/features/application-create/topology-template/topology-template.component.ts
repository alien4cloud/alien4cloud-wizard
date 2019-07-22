import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { TopologyTemplateService} from '@app/core/services/topology-template.service';
import { TopologyTemplate } from '@app/core/models/topology-template.model';
import { PageEvent } from '@angular/material';
import { debounceTime } from 'rxjs/operators';
import { Environment } from '@app/core/models/environment.model';


@Component({
  selector: 'app-topology-template',
  templateUrl: './topology-template.component.html',
  styleUrls: ['./topology-template.component.css']
})
export class TopologyTemplateComponent implements OnInit {


  panelOpenState = false;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  // indicates data loading
  isLoading: boolean = false;


  // Paginator config
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  query = null;

  // MatPaginator Output
  pageEvent: PageEvent;

  // a form control to bind to serch input
  searchField: FormControl = new FormControl();


  public topologyTemplates: TopologyTemplate[];
  public selectedTopology: TopologyTemplate;
  //public createAppByTopoPayload: AppCreationTopoPayload;

  public appEnvironments: Environment[];

  @Output() selectedTopologyChanged = new EventEmitter();

  constructor(
    private topologyTemplateService: TopologyTemplateService
  ) { }

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
    this.loadTopologies(e.pageIndex);
  }

  private openDetails(applicationId: string) {
    // TODO: query plugin endpoint to retrieve details
    this.panelOpenState = true;
    console.log("Openning ", applicationId);
  }

  private closeDetails(applicationId: string) {
    // TODO: query plugin endpoint to retrieve details
    this.panelOpenState = false;
    console.log("closing ", applicationId);
  }

  getSelectedTopology(archiveName: string) {
    this.topologyTemplateService.getTopologyById(archiveName).
      subscribe((data: {}) => {
        this.selectedTopology = data['data']['topology'] as TopologyTemplate;
        this.selectedTopologyChanged.emit();
      })
  }

}
