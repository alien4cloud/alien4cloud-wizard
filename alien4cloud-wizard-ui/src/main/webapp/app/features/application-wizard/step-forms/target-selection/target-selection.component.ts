import {Component, Input, OnInit} from '@angular/core';
import {WizardFromComponent} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.component";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/fsm/application-wizard-machine.schema";
import {WizardFormStep} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.schema";
import {ApplicationOverview} from "@app/core";

@Component({
  selector: 'w4c-target-selection',
  templateUrl: './target-selection.component.html',
  styleUrls: ['./target-selection.component.css']
})
export class TargetSelectionComponent implements OnInit, WizardFromComponent {

  @Input() fsmContext: ApplicationWizardMachineContext;
  @Input() wizardFormStep: WizardFormStep;

  constructor() { }

  ngOnInit() {
  }



}
