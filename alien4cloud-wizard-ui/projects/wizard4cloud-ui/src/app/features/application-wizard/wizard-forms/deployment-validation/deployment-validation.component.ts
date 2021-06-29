import {Component, Inject, OnInit} from '@angular/core';
import { AppplicationWizardMachineService } from '../../core/fsm.service';
import { DoSubmitDeployment } from '../../core/fsm.events';
import { WizardFormComponent } from "@app/features/application-wizard/core/wizard.model";
import {RedirectionTask, TaskCode} from "@app/core/models";
import {DOCUMENT} from "@angular/common";
import {SettingsService} from "@alien4cloud/wizard4cloud-commons";

@Component({
  selector: 'w4c-deployment-validation',
  templateUrl: './deployment-validation.component.html',
  styleUrls: ['./deployment-validation.component.css']
})
export class DeploymentValidationComponent extends WizardFormComponent implements OnInit {

  constructor(
    protected fsm: AppplicationWizardMachineService
  ) { super(fsm); }

  deployApp() {
    this.fsm.send(new DoSubmitDeployment());
  }

  ngOnInit() {
  }

}
