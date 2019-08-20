import { Component, OnInit, Input } from '@angular/core';
import { ApplicationWizardMachineContext } from '../../core/fsm.model';
import { AppplicationWizardMachineService } from '../../core/fsm.service';
import { DoSubmitDeployment, GoBack } from '../../core/fsm.events';
import { WizardFormComponent } from "@app/features/application-wizard/core/wizard.model";
import { ThemePalette } from '@angular/material/core';
import { TranslateService } from "@ngx-translate/core";


export interface TaskCodesWithColor {
  message: string;
  color: ThemePalette;
}


@Component({
  selector: 'w4c-deployment-validation',
  templateUrl: './deployment-validation.component.html',
  styleUrls: ['./deployment-validation.component.css']
})
export class DeploymentValidationComponent implements OnInit, WizardFormComponent {

  @Input() fsmContext: ApplicationWizardMachineContext;

  private taskCodes: TaskCodesWithColor[] = [];

  constructor(
    private fsm: AppplicationWizardMachineService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.deploymentValodationTasks();
  }

  deployApp() {
    this.fsm.send(new DoSubmitDeployment());
  }

  deploymentValodationTasks() {
    let taskList = this.fsmContext.deploymentTopology.validation.taskList;
    if (taskList && taskList.length > 0) {
      taskList.forEach(item => {
        this.taskCodes.push({ message: this.translate.instant('TASK.' + item.code.valueOf()), color: 'warn' });
      });
    } else {
      console.log("No tasks available")
    }
  }
}
