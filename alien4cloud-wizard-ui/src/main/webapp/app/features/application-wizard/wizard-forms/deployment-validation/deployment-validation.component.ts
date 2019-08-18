import { Component, OnInit, Input } from '@angular/core';
import { ApplicationWizardMachineContext } from '../../core/fsm.model';
import { AppplicationWizardMachineService } from '../../core/fsm.service';
import {DoSubmitDeployment, GoBack} from '../../core/fsm.events';
import {WizardFormComponent} from "@app/features/application-wizard/core/wizard.model";

@Component({
  selector: 'w4c-deployment-validation',
  templateUrl: './deployment-validation.component.html',
  styleUrls: ['./deployment-validation.component.css']
})
export class DeploymentValidationComponent implements OnInit , WizardFormComponent {

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
