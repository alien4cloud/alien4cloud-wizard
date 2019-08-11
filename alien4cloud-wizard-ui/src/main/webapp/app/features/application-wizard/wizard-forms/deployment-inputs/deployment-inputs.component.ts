import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {WizardFormComponent} from "@app/features/application-wizard/wizard-main/wizard-main.model";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {
  AbstractPropertyValue, ConstraintError,
  DeploymentTopologyService, PropertyConstraintUtils,
  PropertyDefinition,
  PropertyValue,
  UpdateDeploymentTopologyRequest
} from "@app/core";
import * as _ from 'lodash';
import {DoSearchLocation} from "@app/features/application-wizard/core/fsm.events";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError, debounceTime} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'w4c-deployment-inputs',
  templateUrl: './deployment-inputs.component.html',
  styleUrls: ['./deployment-inputs.component.css']
})
export class DeploymentInputsComponent implements OnInit, WizardFormComponent, AfterViewInit {

  @Input() fsmContext: ApplicationWizardMachineContext;

  private propertieFormDefitions: PropertyFormDefinition[] = new Array<PropertyFormDefinition>();

  /** The form. */
  private inputsForm = new FormGroup({});

  constructor(
    private fsm: AppplicationWizardMachineService,
    private deploymentTopologyService: DeploymentTopologyService
  ) { }


  ngAfterViewInit(): void {
    // if default values exist and no value is already set, fill the form with the default.
    // this will update the deployment setup by calling the backend.
    // FIXME: Should the backend directly manage such default values on deployment topology creation ?
    this.propertieFormDefitions.forEach(pfd => {
      if (pfd.value == undefined && pfd.definition.default) {
        pfd.formControl.setValue(pfd.definition.default.value);
      }
    });
  }

  ngOnInit() {
    let topology = this.fsmContext.deploymentTopology.topology;

    for (const [key, pd] of Object.entries(topology.inputs)) {
      let pfd = new PropertyFormDefinition();
      pfd.label = key;
      pfd.definition = pd;
      if (topology.deployerInputProperties) {
        let property_value = <AbstractPropertyValue>_.get(topology.deployerInputProperties, key);
        pfd.value = property_value;
        if (property_value && !property_value.definition) {
          pfd.displayableValue = (<PropertyValue<any>>property_value).value;
        } else {
          pfd.displayableValue = JSON.stringify(property_value);
        }
      }
      let formControl = new FormControl(pfd.displayableValue);
      if (pfd.definition.required) {
        formControl.setValidators([Validators.required]);
      }
      pfd.formControl = formControl;
      this.inputsForm.addControl(key, formControl);

      pfd.formType = PropertyFormType.INPUT;
      if (pd.type == "integer" || pd.type == "float") {
        pfd.inputType = "number";
      } else if (pd.type == "boolean") {
        pfd.formType = PropertyFormType.CHEKBOX;
      } else {
        pfd.inputType = "text";
        // manage SELECT
        let validValuesConstraint = PropertyConstraintUtils.getValidValuesConstraint(pd);
        if (validValuesConstraint) {
          pfd.validValues = validValuesConstraint.validValues;
          pfd.formType = PropertyFormType.SELECT;
        }
      }

      this.propertieFormDefitions.push(pfd);
    }

    // listen for each formControl change events using a debounce time
    this.propertieFormDefitions.forEach((pfd, key) => {
      pfd.formControl.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
        this.onValueChange(pfd, value);
      });
    });

  }

  /**
   * When a formControl value change, we call the backend to update properties. The validation is done by backend.
   *
   * @param pfd
   * @param value
   */
  onValueChange(pfd: PropertyFormDefinition, value: any) {
    console.log(`Form value changed for ${pfd.label}, value is :`, JSON.stringify(value));
    let request = new UpdateDeploymentTopologyRequest();
    request.inputProperties = new Object();
    request.inputProperties[pfd.label] = value;
    this.deploymentTopologyService.updateDeploymentSetup(this.fsmContext.applicationId, this.fsmContext.environmentId, request)
      .pipe(catchError(err => {
        if (err instanceof ConstraintError) {
          let constraintInformation = (<ConstraintError>err).constraintInformation;
          console.log(`An error occured for ${constraintInformation.name}, code was: ${err.code}, message was: ${err.message}, full information was: `, JSON.stringify(constraintInformation));
          pfd.formControl.setErrors({"constraint": err.message});
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


  doSearchLocation() {
    this.fsm.send(new DoSearchLocation(this.fsmContext.deploymentTopology));
  }
}

export enum PropertyFormType {
  INPUT = "INPUT", CHEKBOX = "CHEKBOX", SELECT = "SELECT"
}

export class PropertyFormDefinition {
  /** The input name. */
  label: string;
   /** The property definition. */
  definition: PropertyDefinition;
  /** The raw value. */
  value: AbstractPropertyValue;
  /** The value to display. */
  displayableValue: string;
  /** When we have a constraint of type valid_values, this is used to fill the drop box. */
  validValues: string[];
  /** Define the type of component that will be displayed to fill the property. */
  formType: PropertyFormType;
  /** The angular form control itself. */
  formControl: FormControl;
  // input type managed by angular : https://material.angular.io/components/input/overview
  inputType: string;
}
