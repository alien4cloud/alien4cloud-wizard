import {Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {WizardFormComponent} from "@app/features/application-wizard/wizard-main/wizard-main.model";
import {LocationMatch, TopologyService, DeploymentTopologyDTO} from '@app/core';
import {AppplicationWizardMachineService} from '@app/features/application-wizard/core/fsm.service';
import {DoSelectLocation} from '@app/features/application-wizard/core/fsm.events';

@Component({
  selector: 'w4c-target-selection',
  templateUrl: './location-selection.component.html',
  styleUrls: ['./location-selection.component.scss']
})
export class LocationSelectionComponent implements OnInit, WizardFormComponent {

  environmentLocation: LocationMatch[];
  deploymentTopology: DeploymentTopologyDTO;
  @Input() fsmContext: ApplicationWizardMachineContext;

  constructor(
    private topologyService: TopologyService,
    private fsm: AppplicationWizardMachineService
  ) {
  }

  ngOnInit() {
    this.environmentLocation = this.fsmContext.locations;
    this.deploymentTopology = this.fsmContext.deploymentTopology ;
    console.log( "The condition is :"+JSON.stringify( this.deploymentTopology.locationPolicies));
 }

  selectLocation(locationId: string, locationName: string, orchestratorId: string) {
    console.log(`Selected template: id=${locationId}`);
    this.fsm.send(new DoSelectLocation(locationId, locationName, orchestratorId));
  } 



}
