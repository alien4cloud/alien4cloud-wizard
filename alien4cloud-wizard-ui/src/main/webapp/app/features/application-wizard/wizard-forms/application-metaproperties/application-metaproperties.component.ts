import {Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {GoBack, OnFormCompleted} from "@app/features/application-wizard/core/fsm.events";
import {
  ApplicationService,
  ConstraintError,
  MetaPropConfiguration,
  MetaPropertyConfiguration,
  ScalarPropertyValue
} from "@app/core";
import {ApplicationMetaPropertyService} from "@app/core";
import {catchError} from "rxjs/operators";
import {Observable} from "rxjs";
import {FormGroup} from "@angular/forms";
import {WizardFormComponent} from "@app/features/application-wizard/core/wizard.model";

@Component({
  selector: 'w4c-application-metaproperties',
  templateUrl: './application-metaproperties.component.html',
  styleUrls: ['./application-metaproperties.component.css']
})
export class ApplicationMetapropertiesComponent extends WizardFormComponent implements OnInit {

  /** The form. */
  metaPropertiesForm = new FormGroup({});

  metaPropertyDefinitions: MetaPropertyDefinition[] = new Array();

  constructor(
    protected fsm: AppplicationWizardMachineService,
    private applicationMetaPropertyService: ApplicationMetaPropertyService,
    private applicationService: ApplicationService
  ) { super(fsm); }

  ngOnInit() {
    this.applicationService.getById(this.fsmContext.application.id).subscribe(application => {
      if (this.fsmContext.applicationMetapropertiesConfiguration) {
        this.fsmContext.applicationMetapropertiesConfiguration.forEach(metaPropertyConfiguration => {
          let definition = new MetaPropertyDefinition();
          definition.configuration = metaPropertyConfiguration;
          if (application.metaProperties) {
            definition.value = new ScalarPropertyValue(application.metaProperties[definition.configuration.id]);
          }
          this.metaPropertyDefinitions.push(definition);
        });
      }
    });
  }

  doComplete() {
    this.fsm.send(new OnFormCompleted());
  }

  formIsValid() {
    return !this.metaPropertiesForm.invalid;
  }

  metapropertyValueChanged(mpc: MetaPropertyConfiguration, value: any) {
    console.log(`A value has changed for ${mpc.name}, event is: `, JSON.stringify(value));
    this.applicationMetaPropertyService
      .upsertProperty(this.fsmContext.application.id, {definitionId: mpc.id, value: value})
      .pipe(catchError(err => {
        if (err instanceof ConstraintError) {
          let constraintInformation = (<ConstraintError>err).constraintInformation;
          console.log(`An error occured for ${constraintInformation.name}, code was: ${err.code}, message was: ${err.message}, full information was: `, JSON.stringify(constraintInformation));
          this.metaPropertiesForm.get(mpc.id).setErrors({"constraint": err.message});
        }
        // FIXME: take ?
        return new Observable(undefined);
      }))
      .subscribe(ci => {
        console.log("Return ci: ", JSON.stringify(mpc));
      }
    );
  }

}

export class MetaPropertyDefinition {
  configuration: MetaPropConfiguration;
  value: ScalarPropertyValue;
}
