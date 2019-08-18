import {Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {
  AbstractPropertyValue, ConstraintError, DeploymentTopologyService,
  PropertyDefinition,
  UpdateDeploymentTopologyRequest
} from "@app/core";
import {OnFormCompleted} from "@app/features/application-wizard/core/fsm.events";
import {FormGroup} from "@angular/forms";
import {catchError} from "rxjs/operators";
import {Observable} from "rxjs";
import {WizardFormComponent} from "@app/features/application-wizard/core/wizard.model";

@Component({
  selector: 'w4c-deployment-inputs',
  templateUrl: './deployment-inputs.component.html',
  styleUrls: ['./deployment-inputs.component.css']
})
export class DeploymentInputsComponent implements OnInit, WizardFormComponent {

  @Input() fsmContext: ApplicationWizardMachineContext;

  public propertieFormDefitions: PropertyFormDefinition[] = new Array<PropertyFormDefinition>();

  /** The form. */
  private inputsForm = new FormGroup({});

  constructor(
    private fsm: AppplicationWizardMachineService,
    private deploymentTopologyService: DeploymentTopologyService
  ) { }

  ngOnInit() {
    // FIXME : we need to retrieve the deploymentTopology since the one fom context is not always fresh even after refresh
    this.deploymentTopologyService.getDeploymentTopology(
      this.fsmContext.application.id,
      this.fsmContext.environmentId
    ).subscribe(deploymentTopology => {
      // if we could .forEach on inputs, we could iterate directly in the html
      for (const [key, pd] of Object.entries(deploymentTopology.topology.inputs)) {
        let pfd = new PropertyFormDefinition();
        pfd.inputName = key;
        pfd.definition = pd;
        if (deploymentTopology.topology.deployerInputProperties) {
          let property_value = <AbstractPropertyValue>(deploymentTopology.topology.deployerInputProperties[key]);
          console.log(`Input ${key} has value: ${ JSON.stringify(property_value) }`);
          pfd.value = property_value;
        }
        this.propertieFormDefitions.push(pfd);
      }
      // we need to wait for rendering
      setTimeout(() => { this.initDefaults(); }, 500);
    })

  }

  initDefaults(): void {
    // if default values exist and no value is already set, fill the form with the default.
    // this will update the deployment setup by calling the backend.
    // FIXME: Should the backend directly manage such default values on deployment topology creation ?
    this.propertieFormDefitions.forEach(pfd => {
      if (!pfd.value && pfd.definition.default) {
        pfd.value = pfd.definition.default;
      }
    });
  }

  /**
   * When a formControl value change, we call the backend to update properties. The validation is done by backend.
   *
   * @param pfd
   * @param value
   */
  inputValueChanged(inputName: string, value: any) {
    console.log(`Form value changed for ${inputName}, value is :`, JSON.stringify(value));
    let request = new UpdateDeploymentTopologyRequest();
    request.inputProperties = new Object();
    request.inputProperties[inputName] = value;
    // this.inputsForm.get(inputName).markAsPending();
    // this.inputsForm.markAsPending();
    this.deploymentTopologyService.updateDeploymentSetup(this.fsmContext.application.id, this.fsmContext.environmentId, request)
      .pipe(catchError(err => {
        if (err instanceof ConstraintError) {
          let constraintInformation = (<ConstraintError>err).constraintInformation;
          console.log(`An error occured for ${constraintInformation.name}, code was: ${err.code}, message was: ${err.message}, full information was: `, JSON.stringify(constraintInformation));
          this.inputsForm.get(inputName).setErrors({"constraint": err.message});
        }
        // FIXME: take ?
        return new Observable(undefined);
      }))
      .subscribe(
        value => {
          console.log("received topology after update: ", JSON.stringify(value));
        }
      );
  }

  formIsValid() {
    return !this.inputsForm.invalid;
  }

  doSearchLocation() {
    this.fsm.send(new OnFormCompleted());
  }
}

export class PropertyFormDefinition {
  /** The input name. */
  inputName: string;
   /** The property definition. */
  definition: PropertyDefinition;
  /** The raw value. */
  value: AbstractPropertyValue;
}
