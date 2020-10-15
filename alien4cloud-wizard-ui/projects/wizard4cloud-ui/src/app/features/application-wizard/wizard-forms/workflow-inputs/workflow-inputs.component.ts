import {Component, Input, OnInit} from '@angular/core';
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {
  ConstraintError
} from "@app/core/models";
import {OnFormCompleted, OnWorkflowLaunched} from "@app/features/application-wizard/core/fsm.events";
import {FormGroup} from "@angular/forms";
import {catchError} from "rxjs/operators";
import {Observable} from "rxjs";
import {WizardFormComponent} from "@app/features/application-wizard/core/wizard.model";
import {
  ApplicationDeploymentService,
  UpdateDeploymentTopologyRequest
} from "@app/core/services";
import {
  AbstractPropertyValue,
  PropertyDefinition
} from "@alien4cloud/wizard4cloud-commons";
import {PropertiesService} from "@app/core/services/properties.service";
import {PropertyValidationRequest} from "@app/core/models/properties-validation.model";

@Component({
  selector: 'w4c-workflow-inputs',
  templateUrl: './workflow-inputs.component.html',
  styleUrls: ['./workflow-inputs.component.css']
})
export class WorkflowInputsComponent extends WizardFormComponent implements OnInit {

  public propertieFormDefitions: PropertyFormDefinition[] = new Array<PropertyFormDefinition>();

  /** The form. */
  inputsForm = new FormGroup({});

  constructor(
    protected fsm: AppplicationWizardMachineService,
    private applicationDeploymentService: ApplicationDeploymentService,
    private propertiesService: PropertiesService
  ) { super(fsm); }

  ngOnInit() {
    for (const [key, pd] of Object.entries(this.fsmContext.deploymentTopology.workflows[this.fsmContext.workflowId].inputs)) {
      let pfd = new PropertyFormDefinition();
      pfd.inputName = key;
      pfd.definition = <PropertyDefinition>pd;
      this.propertieFormDefitions.push(pfd);
    }
    this.initValuesWithLast();
  }

  initValuesWithLast() {
    this.applicationDeploymentService.getLastWorkflowInputs(this.fsmContext.application.id, this.fsmContext.environment.id, this.fsmContext.workflowId).subscribe(inputValues => {
      for (const [key, value] of Object.entries(inputValues)) {
        let pdf = this.propertieFormDefitions.find(pfd => pfd.inputName == key);
        if (pdf) {
          pdf.value = value;
        }
      }
      this.initDefaults();
    });
  }

  initDefaults(): void {
    // if default values exist and no value is already set, fill the form with the default.
    this.propertieFormDefitions.forEach(pfd => {
      if (!pfd.value && pfd.definition.default) {
        pfd.value = pfd.definition.default;
        this.inputsForm.get(pfd.inputName).setValue(pfd.definition.default.value);
      }
    });
  }

  private erase() {
    this.propertieFormDefitions.forEach(pfd => {
      pfd.value = undefined;
      this.inputsForm.get(pfd.inputName).reset();
    });
  }

  reset(event: any): void {
    event.stopPropagation();
    this.erase();
    this.initValuesWithLast();
  }

  clear() {
    this.erase();
    this.initDefaults();
  }

  /**
   * When a formControl value change, we call the backend to update properties. The validation is done by backend.
   *
   * @param pfd
   * @param value
   */
  inputValueChanged(pd: PropertyFormDefinition, value: any) {
    if (value == null) {
      // no check for a null value
      return;
    }
    console.log(`Form value changed for ${pd.inputName}, value is :`, JSON.stringify(value));
    let request = new PropertyValidationRequest();
    request.definitionId = pd.inputName;
    request.propertyDefinition = pd.definition;
    request.value = value;
    request.dependencies = this.fsmContext.deploymentTopology.dependencies;
    this.propertiesService.check(request).pipe(catchError(err => {
      this.inputsForm.get(pd.inputName).setErrors({"constraint": err.message});
      return new Observable(undefined);
    })).subscribe();
  }

  formIsValid() {
    return !this.inputsForm.invalid;
  }

  formIsDirty() {
    return this.inputsForm.dirty;
  }

  doSubmitForm() {
    // here launch workflow
    let inputs: any = {};
    this.propertieFormDefitions.forEach(pfd => {
      if (this.inputsForm.get(pfd.inputName).valid) {
        inputs[pfd.inputName] = this.inputsForm.get(pfd.inputName).value;
      }
    });
    this.applicationDeploymentService.launchWorkflow(this.fsmContext.application.id, this.fsmContext.environment.id, this.fsmContext.workflowId, inputs).subscribe(executionId => {
      console.log(`Execution ID for workflow ${this.fsmContext.workflowId} is ${executionId}`);
      this.fsm.send(new OnWorkflowLaunched(executionId));
    });
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
