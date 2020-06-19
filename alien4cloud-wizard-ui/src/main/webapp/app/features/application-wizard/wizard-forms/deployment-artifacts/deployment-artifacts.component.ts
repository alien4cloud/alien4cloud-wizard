import {Component, Input, OnInit} from '@angular/core';
import {WizardFormComponent} from "@app/features/application-wizard/core/wizard.model";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {OnFormCompleted} from "@app/features/application-wizard/core/fsm.events";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {ConstraintError, DeploymentArtifact, DeploymentTopologyDTO, DeploymentTopologyService} from "@app/core";
import {catchError} from "rxjs/operators";
import {Observable} from "rxjs";
import * as _ from "lodash";

@Component({
  selector: 'w4c-deployment-artifacts',
  templateUrl: './deployment-artifacts.component.html',
  styleUrls: ['./deployment-artifacts.component.css']
})
export class DeploymentArtifactsComponent extends WizardFormComponent implements OnInit {

  artifacts: Map<string, DeploymentArtifact> = new Map<string, DeploymentArtifact>();

  constructor(
    protected fsm: AppplicationWizardMachineService,
    private deploymentTopologyService: DeploymentTopologyService
  ) { super(fsm); }

  ngOnInit() {
    this.artifacts = this.fsmContext.deploymentTopologyDTO.topology.inputArtifacts;
    this.artifacts = _.merge(this.artifacts, this.fsmContext.deploymentTopologyDTO.topology.uploadedInputArtifacts);
  }

  formIsValid() {
    return true;
  }

  doSubmitForm() {
    this.fsm.send(new OnFormCompleted());
  }

  uploadFile(inputArtifactId: string, event: any) {
    this.deploymentTopologyService.uploadDeploymentInputArtifact(this.fsmContext.application.id, this.fsmContext.environment.id, inputArtifactId, event)
      .pipe(catchError(err => {
        if (err instanceof ConstraintError) {
          let constraintInformation = (<ConstraintError>err).constraintInformation;
          console.log(`An error occured for ${constraintInformation.name}, code was: ${err.code}, message was: ${err.message}, full information was: `, JSON.stringify(constraintInformation));
          // TODO: display arror
          // this.inputsForm.get(inputName).setErrors({"constraint": err.message});
        }
        // FIXME: take ? and remove the cast below
        return new Observable(undefined);
      }))
      .subscribe(
        dto => {
          console.log("received topology after update: ", JSON.stringify(dto));
          this.artifacts = _.merge(this.artifacts, (<DeploymentTopologyDTO>dto).topology.uploadedInputArtifacts);
        }
      )
  }

}
