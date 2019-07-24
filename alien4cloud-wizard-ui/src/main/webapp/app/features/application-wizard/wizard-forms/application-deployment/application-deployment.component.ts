import { Component, OnInit, Input } from '@angular/core';
import {WizardFormComponent} from "@app/features/application-wizard/wizard-main/wizard-main.model";
import { ApplicationWizardMachineContext } from '../../core/fsm.model';
import { AppplicationWizardMachineService } from '../../core/fsm.service';

@Component({
  selector: 'w4c-application-deployment',
  templateUrl: './application-deployment.component.html',
  styleUrls: ['./application-deployment.component.css']
})
export class ApplicationDeploymentComponent implements OnInit , WizardFormComponent {

  @Input() fsmContext: ApplicationWizardMachineContext;
  

  constructor(private fsm: AppplicationWizardMachineService) { }

  ngOnInit() {
  }

}
