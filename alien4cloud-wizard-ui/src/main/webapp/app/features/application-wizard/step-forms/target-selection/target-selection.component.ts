import {Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/fsm/application-wizard-machine.model";
import {WizardFormComponent} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.model";

@Component({
  selector: 'w4c-target-selection',
  templateUrl: './target-selection.component.html',
  styleUrls: ['./target-selection.component.css']
})
export class TargetSelectionComponent implements OnInit, WizardFormComponent {

  @Input() fsmContext: ApplicationWizardMachineContext;

  constructor() { }

  ngOnInit() {
  }

}
