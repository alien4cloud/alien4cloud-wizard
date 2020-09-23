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
    protected fsm: AppplicationWizardMachineService,
    private settingsService: SettingsService,
    @Inject(DOCUMENT) private document: Document
  ) { super(fsm); }

  deployApp() {
    this.fsm.send(new DoSubmitDeployment());
  }

  ngOnInit() {
    const redirectInNewTab = this.settingsService.getSetting(SettingsService.REDIRECT_IN_NEW_TAB) == 'true';
    console.log("taskList: ", this.fsmContext.deploymentTopologyDTO.validation.taskList);
    if (this.fsmContext.deploymentTopologyDTO.validation.taskList) {
      this.fsmContext.deploymentTopologyDTO.validation.taskList.filter(value => {
        if (value.code == TaskCode.REDIRECTION_REQUIRED) {
          console.log("Redirection detected: ", value);
          console.log("Current url: ", window.location.href);
          const task = <RedirectionTask>value;
          let url = task.url;
          if (task.backUrlParam) {
            let regexp = /(.*)(new-wizard|app-wizard).*/g;
            let groups = regexp.exec(window.location.href);
            // We need to build a back URL regarding curent URL
            // If we are in a new wizard, we will route to the app wizard (as if we were passed by dashboard)
            let backUrl = groups[1] + "app-wizard/" + this.fsmContext.application.id + "/" + this.fsmContext.environment.id;
            console.log("back url: ", backUrl);
            if (url.indexOf("?") > -1 ) {
              // URL has already params
              url = url + "&" + task.backUrlParam + "=" + encodeURIComponent(backUrl);
            } else {
              // URL don't have params
              url = url + "?" + task.backUrlParam + "=" + encodeURIComponent(backUrl);
            }
          }
          if (redirectInNewTab) {
            window.open(url, "_blank");
          } else {
            this.document.location.href = url;
          }
        }
      })
    }

  }

}
