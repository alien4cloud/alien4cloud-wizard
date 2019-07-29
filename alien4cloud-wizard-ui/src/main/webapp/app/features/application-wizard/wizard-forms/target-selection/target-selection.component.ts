import { Component, Input, OnInit } from '@angular/core';
import { ApplicationWizardMachineContext } from "@app/features/application-wizard/core/fsm.model";
import { WizardFormComponent } from "@app/features/application-wizard/wizard-main/wizard-main.model";
import {TopologyTemplateService, EnvironmentLocation, ConcretGenericsService, TopologyTemplate} from '@app/core';
import { AppplicationWizardMachineService } from '../../core/fsm.service';
import { DoSelectTarget } from '../../core/fsm.events';

@Component({
  selector: 'w4c-target-selection',
  templateUrl: './target-selection.component.html',
  styleUrls: ['./target-selection.component.css']
})
export class TargetSelectionComponent implements OnInit, WizardFormComponent {


  environmentLocation: EnvironmentLocation[];
  locationPolicies : TopologyTemplate;
  @Input() fsmContext: ApplicationWizardMachineContext;

  constructor(
    private genericsService: ConcretGenericsService,
    private topologyTemplateService: TopologyTemplateService,
    private fsm: AppplicationWizardMachineService
  ) { }

  ngOnInit() {
    this.getEnvironmentLocations();
  }

  selectLocation(locationId: string, orchestratorId : string) {
    this.fsmContext.orchestratorId = orchestratorId ;
    this.fsmContext.locationId = locationId
    console.log(`Selected template: id=${locationId}`);
    this.fsm.send(new DoSelectTarget(locationId));
  }

  public postLocationPolicies() {
    this.topologyTemplateService.postLocationPolicies(this.fsmContext.templateId,  this.fsmContext.environmentId,this.environmentLocation[0].orchestrator.id,this.environmentLocation[0].location.name).
      subscribe((data: {}) => {
        this.locationPolicies = data['data']['topology'] as TopologyTemplate;
        console.log("The Location Policyes  post response :", this.locationPolicies.archiveName);
        //this.getEnvironmentLocations();
      })
  }


  public getEnvironmentLocations() {
    this.topologyTemplateService.getEnvLocations(this.fsmContext.templateId, this.fsmContext.environmentId).
      subscribe((data: {}) => {
        this.environmentLocation = data['data'] as EnvironmentLocation[];
        console.log("First Location The deployment topology :", this.environmentLocation[0].location.name);
      })
  }
}
