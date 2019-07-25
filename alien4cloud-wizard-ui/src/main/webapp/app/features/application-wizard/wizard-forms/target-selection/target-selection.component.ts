import { Component, Input, OnInit } from '@angular/core';
import { ApplicationWizardMachineContext } from "@app/features/application-wizard/core/fsm.model";
import { WizardFormComponent } from "@app/features/application-wizard/wizard-main/wizard-main.model";
import {
  GenericsService, Environment, TopologyTemplateService, EnvironmentLocation, ConcretGenericsService, TopologyTemplate,
  //Environment, 
  //EnvironmentLocation, 
  //DeploymentPropertyCheck, 
  //DefinitionIdValues 
} from '@app/core';
import { AppplicationWizardMachineService } from '../../core/fsm.service';
import { DoSelectTarget } from '../../core/fsm.events';
@Component({
  selector: 'w4c-target-selection',
  templateUrl: './target-selection.component.html',
  styleUrls: ['./target-selection.component.css']
})
export class TargetSelectionComponent implements OnInit, WizardFormComponent {

  // Paginator config
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  query = null;
  appEnvironments: Environment[];
  environmentLocation: EnvironmentLocation[];
  locationPolicies : TopologyTemplate;
  numberOflocations: number;
  @Input() fsmContext: ApplicationWizardMachineContext;

  constructor(
    //private genericsService: GenericsService,
    private genericsService: ConcretGenericsService,
    private topologyTemplateService: TopologyTemplateService,
    private fsm: AppplicationWizardMachineService
  ) { }

  ngOnInit() {
    this.getAppEnvironments(0);
  }

  selectLocation(locationId: string, orchestratorId : string) {

    this.fsmContext.orchestratorId = orchestratorId ;
    this.fsmContext.locationId = locationId
    //alert(locationId + " is selected")
    console.log(`Selected template: id=${locationId}`);
    this.fsm.send(new DoSelectTarget());
  }




  getAppEnvironments(from: number) {
    this.genericsService.getAppEnvironments(from, this.pageSize, this.query, this.fsmContext.applicationId).subscribe((data: {}) => {
      this.appEnvironments = data['data']['data'];
      this.fsmContext.environmentId = this.appEnvironments[0].id ;
      if (this.length > 0) {
        console.log("environment id  :" + this.appEnvironments[0].id);
        this.getEnvironmentLocations();
      } else {
        console.warn("THERE IS NO ENVIRONMENT");
      }
    })
  }

  public postLocationPolicies() {
    this.topologyTemplateService.postLocationPolicies(this.fsmContext.templateId, this.appEnvironments[0].id,this.environmentLocation[0].orchestrator.id,this.environmentLocation[0].location.name).
      subscribe((data: {}) => {
        this.locationPolicies = data['data']['topology'] as TopologyTemplate;
        console.log("The Location Policyes  post response :", this.locationPolicies.archiveName);
        //this.getEnvironmentLocations();
      })
  }


  public getEnvironmentLocations() {

    this.topologyTemplateService.getEnvLocations(this.fsmContext.templateId, this.appEnvironments[0].id).
      subscribe((data: {}) => {
        this.environmentLocation = data['data'] as EnvironmentLocation[];
        //this.fsmContext.locations = data['data'];
        console.log("First Location The deployment topology :", this.environmentLocation[0].location.name);
      })
  }



}
