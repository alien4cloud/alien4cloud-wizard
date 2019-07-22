import {Component, Input, OnInit} from '@angular/core';
import {WizardFromComponent} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.component";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/fsm/application-wizard-machine.service";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/fsm/application-wizard-machine.schema";
import {DoSelectTemplate} from "@app/features/application-wizard/fsm/application-wizard-machine.events";
import {WizardFormStep} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.schema";

@Component({
  selector: 'w4c-template-selection',
  templateUrl: './template-selection.component.html',
  styleUrls: ['./template-selection.component.css']
})
export class TemplateSelectionComponent implements OnInit, WizardFromComponent {

  constructor(private fsm: AppplicationWizardMachineService) { }

  templateId: string;

  @Input() fsmContext: ApplicationWizardMachineContext;
  @Input() wizardFormStep: WizardFormStep;

  ngOnInit() {
    if (this.fsmContext) {
      this.templateId = this.fsmContext.templateId;
    }
  }

  selectTemplate() {
    console.log(`Selected template: id=${this.templateId}`);
    this.fsm.send(new DoSelectTemplate(this.templateId));
  }

}
