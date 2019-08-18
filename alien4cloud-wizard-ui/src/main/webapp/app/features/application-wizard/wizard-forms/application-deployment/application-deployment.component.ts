import { Component, OnInit, Input } from '@angular/core';
import { ApplicationWizardMachineContext } from '../../core/fsm.model';
import { AppplicationWizardMachineService } from '../../core/fsm.service';
import {DoSubmitDeployment, GoBack} from '../../core/fsm.events';
import {WizardFormComponent} from "@app/features/application-wizard/core/wizard.model";

@Component({
  selector: 'w4c-application-deployment',
  templateUrl: './application-deployment.component.html',
  styleUrls: ['./application-deployment.component.css']
})
export class ApplicationDeploymentComponent implements OnInit , WizardFormComponent {

  @Input() fsmContext: ApplicationWizardMachineContext;
  
  constructor(
    private fsm: AppplicationWizardMachineService
  ) { }

  ngOnInit() {
  }

  deployApp(){
    this.fsm.send(new DoSubmitDeployment());
  }

}
