import {Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {WizardFormComponent} from "@app/features/application-wizard/wizard-main/wizard-main.model";
import {LocationMatch, TopologyService, DeploymentTopologyDTO} from '@app/core';
import {AppplicationWizardMachineService} from '@app/features/application-wizard/core/fsm.service';
import {DoSelectLocation, GoBack, OnFormCompleted} from '@app/features/application-wizard/core/fsm.events';

@Component({
  selector: 'w4c-target-selection',
  templateUrl: './location-selection.component.html',
  styleUrls: ['./location-selection.component.scss']
})
export class LocationSelectionComponent implements OnInit, WizardFormComponent {


  /**
   * A map of locationId -> LocationMatch.
   */
  locationItems = new Map<string, LocationMatch>();

  selectedLocationId: string;

  @Input() fsmContext: ApplicationWizardMachineContext;

  constructor(
    private topologyService: TopologyService,
    private fsm: AppplicationWizardMachineService
  ) {
  }

  ngOnInit() {
    this.fsmContext.locations.forEach(location => {
      this.locationItems.set(location.location.id, location);
    });
    if (this.fsmContext.deploymentTopology.locationPolicies && this.fsmContext.deploymentTopology.locationPolicies['_A4C_ALL']) {
      this.selectedLocationId = this.fsmContext.deploymentTopology.locationPolicies['_A4C_ALL'];
    }
 }

  selectLocation(locationId: string) {
    let item = this.locationItems.get(locationId);
    if (!item.ready) {
      // the location is not ready, just do nothing
      return;
    }
    if (locationId !== this.selectedLocationId) {
      this.selectedLocationId = locationId;
    }
    // FIXME: here we could optimize, maybe it's not necessary to call setPolicies if the location has not changed
    this.goForward();
  }

  goForward() {
    let item = this.locationItems.get(this.selectedLocationId);
    this.fsm.send(new DoSelectLocation(item.location.id, item.location.name, item.location.orchestratorId));
  }

  formIsValid() {
    // return true only a location is select and this location is active
    if (this.selectedLocationId && this.locationItems.get(this.selectedLocationId).ready) {
      return true;
    }
  }

}
