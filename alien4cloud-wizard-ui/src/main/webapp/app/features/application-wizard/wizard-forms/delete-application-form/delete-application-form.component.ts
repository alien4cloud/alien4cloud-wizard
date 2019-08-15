import {Component, Input, OnInit} from '@angular/core';
import {WizardFormComponent} from "@app/features/application-wizard/wizard-main/wizard-main.model";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";

@Component({
  selector: 'w4c-delete-application-form',
  templateUrl: './delete-application-form.component.html',
  styleUrls: ['./delete-application-form.component.css']
})
export class DeleteApplicationFormComponent implements OnInit, WizardFormComponent {

  @Input() fsmContext: ApplicationWizardMachineContext;

  constructor(private fsm: AppplicationWizardMachineService) { }

  ngOnInit() {
  }

}
