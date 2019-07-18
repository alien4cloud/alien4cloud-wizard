import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TopologyTemplateService, AppCreationTopoPayload } from '@app/core/services/topology-template.service';
import { TopologyTemplate } from '@app/core/models/topology-template.model';
import { PageEvent } from '@angular/material';
import { debounceTime } from 'rxjs/operators';
import { GenericsService } from '@app/core/services/generics.service';
import { Environment } from '@app/core/models/environment.model';

@Component({
  selector: 'app-application-create',
  templateUrl: './application-create.component.html',
  styleUrls: ['./application-create.component.css']
})
export class ApplicationCreateComponent implements OnInit {
  panelOpenState = false;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
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


  public topologyTemplate: TopologyTemplate[];
  public selectedTopolofy: TopologyTemplate;
  public createAppByTopoPayload: AppCreationTopoPayload;

  public appEnvironments :Environment[];

  constructor(
    private _formBuilder: FormBuilder,
    private topologyTemplateService: TopologyTemplateService,
    private genericsService: GenericsService
  ) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });


    this.loadTopologies(0);
    // add a debounceTimed suscription to avoid bakend mass attack
    this.searchField.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(term => {
        this.query = term;
        this.loadTopologies(0);
      });
    //this.getAppEnvironments(0);
  }


  private loadTopologies(from: number) {
    this.isLoading = true;
    this.topologyTemplateService.getTopologies(from, this.pageSize, this.query).subscribe((data: {}) => {
      this.topologyTemplate = data['data']['data'] as TopologyTemplate[];
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

  getAppEnvironments(from: number) {
    let getTopoUrl = `/rest/latest/applications/arch_${this.selectedTopolofy.archiveName}` + `/environments/search`;
    console.log("url env app :" + getTopoUrl);
    this.isLoading = true;
    this.genericsService.getGenerics(getTopoUrl, from, this.pageSize, this.query).subscribe((data: {}) => {
      this.appEnvironments = data['data']['data'] ;
      this.length = data['data']['totalResults'];
      if( this.length > 0){
        console.log("environment id  :" + this.appEnvironments[0].id );
      } else {
        console.warn("THERE IS NO ENVIRONMENT");
      }    
      this.isLoading = false;
    })
  }


  private createAppByTopo() {
    this.isLoading = true;
    //this.createAppByTopoPayload = {"name": "appetitions-"+this.selectedTopolofy.archiveName, "archiveName": "archivas-"+this.selectedTopolofy.archiveName, "topologyTemplateVersionId": this.selectedTopolofy.id }
    //console.log("The topology selected is :",this.createAppByTopoPayload.name) ;
    this.topologyTemplateService.createAppByTopology(this.createAppByTopoPayload).subscribe((data: {}) => {
      
      if(data["data"]!=null) {
        console.log("successfully crated App : ", data["data"])
      } else {
        console.log("Error ",data["error"]["message"])
      }
      this.getAppEnvironments(0);

      this.isLoading = false;
    });

    
  }

  private async createAppByTopoAsync() {
    this.isLoading = true;
    let data = this.topologyTemplateService.createAppByTopology(this.createAppByTopoPayload);
    console.log("successfully crated App : ", data["data"])

    if(data["data"]!=null) {
      this.getAppEnvironments(0);
    } else {
      console.log("Error ",data["error"]["message"])
    }
  }


  getSelectedTopology(archiveName: string) {
    this.topologyTemplateService.getTopologyById(archiveName).
      subscribe((data: {}) => {
        this.selectedTopolofy = data['data']['topology'] as TopologyTemplate;
        this.createAppByTopoPayload = { "name": "app_" + this.selectedTopolofy.archiveName, "archiveName": "arch_" + this.selectedTopolofy.archiveName, "topologyTemplateVersionId": this.selectedTopolofy.id };
        console.log("The topology selected is :", this.createAppByTopoPayload.name);
      })

    //console.log("The topology selected is :",this.createAppByTopoPayload.archiveName) ;
    //this.createAppByTopo();

  }



  getLocation(environmentId: string, ) {

    let getTopoUrl = `/rest/latest/applications/arch_${this.selectedTopolofy.archiveName}` + `/environments/search`;

    this.topologyTemplateService.getTopologyById(environmentId  ).
      subscribe((data: {}) => {
        this.selectedTopolofy = data['data']['topology'] as TopologyTemplate;
        this.createAppByTopoPayload = { "name": "app_" + this.selectedTopolofy.archiveName, "archiveName": "arch_" + this.selectedTopolofy.archiveName, "topologyTemplateVersionId": this.selectedTopolofy.id };
        console.log("The topology selected is :", this.createAppByTopoPayload.name);
      })

    //console.log("The topology selected is :",this.createAppByTopoPayload.archiveName) ;
    //this.createAppByTopo();

  }

}
