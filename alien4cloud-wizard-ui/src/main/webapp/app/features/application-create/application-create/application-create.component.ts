import { Component, OnInit, ViewChild } from '@angular/core';
import { TopologyTemplateService, AppCreationTopoPayload } from '@app/core/services/topology-template.service';
import { TopologyTemplate } from '@app/core/models/topology-template.model';
import { TopologyTemplateComponent } from '../topology-template/topology-template.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDescriptionComponent } from '../application-description/application-description.component';
import { GenericsService, Environment, EnvironmentLocation, DeploymentPropertyCheck, DefinitionIdValues } from '@app/core';

@Component({
  selector: 'app-application-create',
  templateUrl: './application-create.component.html',
  styleUrls: ['./application-create.component.css']
})
export class ApplicationCreateComponent implements OnInit {

  // indicates data loading
  isLoading: boolean = false;


  // Paginator config
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  query = null;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  // indicates data loading


  @ViewChild(TopologyTemplateComponent, { static: false }) topologyTemplateComponent: TopologyTemplateComponent;
  @ViewChild(ApplicationDescriptionComponent, { static: false }) applicationDescriptionComponent: ApplicationDescriptionComponent;

  public selectedTopology: TopologyTemplate;
  public deploymentTopology: TopologyTemplate;
  public locationPolicies : TopologyTemplate ;
  public environmentLocation: EnvironmentLocation[];
  public selectedTopoArchiveName: string;
  public selectedTopoDescription: string;
  public createAppByTopoPayload: AppCreationTopoPayload;
  public appEnvironments: Environment[];

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
    this.thirdFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

  }


  private createAppByTopo() {
    this.createAppByTopoPayload = { "name": this.applicationDescriptionComponent.displayArchiveName, "archiveName": this.genericsService.trimName(this.applicationDescriptionComponent.displayArchiveName), "description": this.applicationDescriptionComponent.displayDescription, "topologyTemplateVersionId": this.selectedTopology.id };
    console.log("Trimed archive name" + this.genericsService.trimName(this.applicationDescriptionComponent.displayArchiveName))
    this.isLoading = true;
    this.topologyTemplateService.createAppByTopology(this.createAppByTopoPayload).subscribe((data: {}) => {
      if (data["data"] != null) {
        console.log("successfully crated App : ", data["data"])
      } else {
        console.log("Error ", data["error"]["message"])
      }

      //test func 
      this.getAppEnvironments(0);
      this.isLoading = false;
    });
    //getting selected topology from child
  }


  public getSelectedTopologyFromChild() {
    this.selectedTopology = this.topologyTemplateComponent.selectedTopology;
    console.log("topology from child after:" + this.selectedTopology.archiveName)
    this.selectedTopoArchiveName = this.topologyTemplateComponent.selectedTopology.archiveName;
    this.selectedTopoDescription = this.topologyTemplateComponent.selectedTopology.description;
  }


  getLocation(environmentId: string, ) {
    this.topologyTemplateService.getTopologyById(environmentId).
      subscribe((data: {}) => {
        this.selectedTopology = data['data']['topology'] as TopologyTemplate;
        console.log("The topology selected is :", this.createAppByTopoPayload.name);
      })
  }


  getAppEnvironments(from: number) {
    let getTopoUrl = `/rest/latest/applications/${this.genericsService.trimName(this.applicationDescriptionComponent.displayArchiveName)}` + `/environments/search`;
    console.log("url env app :" + getTopoUrl);
    this.isLoading = true;
    this.genericsService.getGenerics(getTopoUrl, from, this.pageSize, this.query).subscribe((data: {}) => {
      this.appEnvironments = data['data']['data'];
      this.length = data['data']['totalResults'];
      if (this.length > 0) {
        console.log("environment id  :" + this.appEnvironments[0].id);

        //test func 
        this.getEnvDeploymentTopology();
      } else {
        console.warn("THERE IS NO ENVIRONMENT");
      }
      this.isLoading = false;
    })
  }


  public getEnvDeploymentTopology() {

    this.topologyTemplateService.getEnvDeploymentTopology(this.genericsService.trimName(this.applicationDescriptionComponent.displayArchiveName), this.appEnvironments[0].id).
      subscribe((data: {}) => {
        this.deploymentTopology = data['data']['topology'] as TopologyTemplate;
        console.log("The deployment topology :", this.deploymentTopology.archiveName);
        //testEnvLocations
        //this.postLocationPolicies()
        this.getEnvironmentLocations()
      })
  }

/*
  public postLocationPolicies() {
    this.topologyTemplateService.postLocationPolicies(this.genericsService.trimName(this.applicationDescriptionComponent.displayArchiveName), this.appEnvironments[0].id).
      subscribe((data: {}) => {
        this.locationPolicies = data['data']['topology'] as TopologyTemplate;
        console.log("The Location Policyes  post response :", this.locationPolicies.archiveName);
        //testEnvLocations
        this.getEnvironmentLocations() ;
      })
  }
  */


  public getEnvironmentLocations() {

    this.topologyTemplateService.getEnvLocations(this.createAppByTopoPayload.topologyTemplateVersionId, this.appEnvironments[0].id).
      subscribe((data: {}) => {
        this.environmentLocation = data['data'] as EnvironmentLocation[];
        console.log("The deployment topology :", this.environmentLocation[0].location.name);

        this.deploymentPropertyCheck(DefinitionIdValues.managerEmail , "manager@gmail.com" );
        this.deploymentPropertyCheck(DefinitionIdValues.managementUrl , "http://manager.com" );
        this.deploymentPropertyCheck(DefinitionIdValues.NumberBackup , "1" );

        //deploy app
        this.deployApplication() ;

      })
  }


  public deploymentPropertyCheck(definitionId :DefinitionIdValues , value :string ) {
    let payload = {"definitionId":definitionId,"value":value}
    this.topologyTemplateService.deploymentPropCheck(payload , this.environmentLocation[0].orchestrator.id).
      subscribe((data: {}) => {
        console.log("property checked :", data['data']);
      })


  }


  public deployApplication() {
    this.topologyTemplateService.deployApplication(this.appEnvironments[0].applicationId , this.appEnvironments[0].id).
    subscribe((data: {}) => {
      console.log("APPLICATION DEPLOYED :", data['data']);
    })
    
  }

  /*
    private async createAppByTopoAsync(createAppByTopoPayload:AppCreationTopoPayload) {
      this.isLoading = true;
      let data = this.topologyTemplateService.createAppByTopology(createAppByTopoPayload);
      console.log("successfully crated App : ", data["data"])
      if(data["data"]!=null) {
        this.getAppEnvironments(0);
      } else {
        console.log("Error ",data["error"]["message"])
      }
    }
  */


}
