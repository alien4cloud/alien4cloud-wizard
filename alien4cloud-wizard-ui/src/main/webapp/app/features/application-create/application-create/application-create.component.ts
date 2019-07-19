import { Component, OnInit, ViewChild } from '@angular/core';
import { TopologyTemplateService, AppCreationTopoPayload } from '@app/core/services/topology-template.service';
import { TopologyTemplate } from '@app/core/models/topology-template.model';
import { TopologyTemplateComponent } from '../topology-template/topology-template.component';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ApplicationDescriptionComponent } from '../application-description/application-description.component';
import { GenericsService, Environment } from '@app/core';

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
    this.createAppByTopoPayload = { "name": "app_" + this.applicationDescriptionComponent.displayArchiveName, "archiveName": "arch_" + this.applicationDescriptionComponent.displayArchiveName, "description": this.applicationDescriptionComponent.displayDescription,"topologyTemplateVersionId": this.selectedTopology.id };
    //this.topologyTemplateComponent.createAppByTopo(this.createAppByTopoPayload);
    this.isLoading = true;
    this.topologyTemplateService.createAppByTopology(this.createAppByTopoPayload).subscribe((data: {}) => {
      if (data["data"] != null) {
        console.log("successfully crated App : ", data["data"])
      } else {
        console.log("Error ", data["error"]["message"])
      }
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

    let getTopoUrl = `/rest/latest/applications/arch_${this.applicationDescriptionComponent.displayArchiveName}` + `/environments/search`;

    this.topologyTemplateService.getTopologyById(environmentId).
      subscribe((data: {}) => {
        this.selectedTopology = data['data']['topology'] as TopologyTemplate;
        this.createAppByTopoPayload = { "name": "app_" + this.applicationDescriptionComponent.displayArchiveName, description:this.applicationDescriptionComponent.displayDescription,"archiveName": "arch_" + this.applicationDescriptionComponent.displayArchiveName, "topologyTemplateVersionId": this.selectedTopology.id };
        console.log("The topology selected is :", this.createAppByTopoPayload.name);
      })
  }


  getAppEnvironments(from: number) {
    let getTopoUrl = `/rest/latest/applications/arch_${this.applicationDescriptionComponent.displayArchiveName}` + `/environments/search`;
    console.log("url env app :" + getTopoUrl);
    this.isLoading = true;
    this.genericsService.getGenerics(getTopoUrl, from, this.pageSize, this.query).subscribe((data: {}) => {
      this.appEnvironments = data['data']['data'];
      this.length = data['data']['totalResults'];
      if (this.length > 0) {
        console.log("environment id  :" + this.appEnvironments[0].id);
      } else {
        console.warn("THERE IS NO ENVIRONMENT");
      }
      this.isLoading = false;
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
