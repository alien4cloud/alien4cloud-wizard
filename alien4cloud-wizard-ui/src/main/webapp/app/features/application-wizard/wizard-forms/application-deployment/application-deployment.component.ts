import { Component, OnInit, Input } from '@angular/core';
import {WizardFormComponent} from "@app/features/application-wizard/wizard-main/wizard-main.model";
import { ApplicationWizardMachineContext } from '../../core/fsm.model';
import { AppplicationWizardMachineService } from '../../core/fsm.service';
import { DoSubmitDeployment } from '../../core/fsm.events';

@Component({
  selector: 'w4c-application-deployment',
  templateUrl: './application-deployment.component.html',
  styleUrls: ['./application-deployment.component.css']
})
export class ApplicationDeploymentComponent implements OnInit , WizardFormComponent {

  application:string ;
  version: string ;
  target : string 

  @Input() fsmContext: ApplicationWizardMachineContext;
  
  constructor(
    private fsm: AppplicationWizardMachineService
  ) { }

  ngOnInit() {
    this.application = this.fsmContext.applicationName;
    //this.version = this.fsmContext.
    this.target = this.fsmContext.locationName;

  }

  deployApp(){
    console.log("About to Deploy")
    this.fsm.send(new DoSubmitDeployment());
  }

  goBack() {
    // TODO: send the appropriate event to go back
    console.log("TODO: send the appropriate event to go back");
  }

}
