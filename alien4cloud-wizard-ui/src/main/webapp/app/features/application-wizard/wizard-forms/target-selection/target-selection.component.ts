import { Component, Input, OnInit } from '@angular/core';
import { ApplicationWizardMachineContext } from "@app/features/application-wizard/core/fsm.model";
import { WizardFormComponent } from "@app/features/application-wizard/wizard-main/wizard-main.model";
import {
  GenericsService, Environment, TopologyTemplateService, EnvironmentLocation,
  //Environment, 
  //EnvironmentLocation, 
  //DeploymentPropertyCheck, 
  //DefinitionIdValues 
} from '@app/core';
import { AppplicationWizardMachineService } from '../../core/fsm.service';
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
  numberOflocations: number;
  @Input() fsmContext: ApplicationWizardMachineContext;

  constructor(
    private genericsService: GenericsService,
    private topologyTemplateService: TopologyTemplateService,
    private fsm: AppplicationWizardMachineService
  ) { }

  ngOnInit() {
    this.getAppEnvironments(0);
  }

  clicked(locationName : string) {
    alert(locationName+ " is selected")
  }



  getAppEnvironments(from: number) {
    let getTopoUrl = `/rest/latest/applications/${this.genericsService.trimName(this.fsmContext.applicationName)}` + `/environments/search`;
    console.log("url env app :" + getTopoUrl);
    this.genericsService.getGenerics(getTopoUrl, from, this.pageSize, this.query).subscribe((data: {}) => {
      this.appEnvironments = data['data']['data'];
      this.fsmContext.appEnvironments = data['data']['data'];
      this.length = data['data']['totalResults'];
      if (this.length > 0) {
        console.log("environment id  :" + this.appEnvironments[0].id);
        this.getEnvironmentLocations();
      } else {
        console.warn("THERE IS NO ENVIRONMENT");
      }
    })
  }

  public getEnvironmentLocations() {

    this.topologyTemplateService.getEnvLocations(this.fsmContext.templateId, this.appEnvironments[0].id).
      subscribe((data: {}) => {
        this.environmentLocation = data['data'] as EnvironmentLocation[];
        this.fsmContext.locations = data['data'] ;
        console.log("First Location The deployment topology :", this.environmentLocation[0].location.name);
      })
  }



}
