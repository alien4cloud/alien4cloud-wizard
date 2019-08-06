import {Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {WizardFormComponent} from "@app/features/application-wizard/wizard-main/wizard-main.model";

@Component({
  selector: 'w4c-wizard-spinner',
  templateUrl: './wizard-spinner.component.html',
  styleUrls: ['./wizard-spinner.component.css']
})
export class WizardSpinnerComponent {

  constructor() { }

  ngOnInit() {
  }

}
