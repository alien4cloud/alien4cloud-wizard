import {Component, Inject, Input, OnInit} from '@angular/core';
import { ApplicationWizardMachineContext } from '../../core/fsm.model';
import { AppplicationWizardMachineService } from '../../core/fsm.service';
import { DoSubmitDeployment } from '../../core/fsm.events';
import { WizardFormComponent } from "@app/features/application-wizard/core/wizard.model";
import { TranslateService } from "@ngx-translate/core";
import {AbstractTask, RedirectionTask, SettingsService, TaskCode} from "@app/core";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'w4c-deployment-validation',
  templateUrl: './deployment-validation.component.html',
  styleUrls: ['./deployment-validation.component.css']
})
export class DeploymentValidationComponent extends WizardFormComponent implements OnInit {

  constructor(
    protected fsm: AppplicationWizardMachineService,
    private settingsService: SettingsService,
    @Inject(DOCUMENT) private document: Document
  ) { super(fsm); }

  deployApp() {
    this.fsm.send(new DoSubmitDeployment());
  }

  ngOnInit() {
    const redirectInNewTab = this.settingsService.getSetting(SettingsService.REDIRECT_IN_NEW_TAB) == 'true';

    this.fsmContext.deploymentTopology.validation.taskList.filter(value => {
      if (value.code == TaskCode.REDIRECTION_REQUIRED) {
        console.log("Redirection detected: ", value);
        const task = <RedirectionTask>value;
        if (redirectInNewTab) {
          window.open(task.url, "_blank");
        } else {
          this.document.location.href = task.url;
        }
      }
    })

  }

}
