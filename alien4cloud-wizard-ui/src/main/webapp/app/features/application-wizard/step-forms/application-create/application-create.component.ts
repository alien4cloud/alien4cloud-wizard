import {Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/fsm/application-wizard-machine.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/fsm/application-wizard-machine.service";
import {DoCreateApplication} from "@app/features/application-wizard/fsm/application-wizard-machine.events";
import {ToscaIdArchiveExtractorPipe, ToscaTypeShortNamePipe} from "@app/shared";
import {WizardFromComponent} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.model";

@Component({
  selector: 'w4c-application-create',
  templateUrl: './application-create.component.html',
  styleUrls: ['./application-create.component.css']
})
export class ApplicationCreateComponent implements OnInit, WizardFromComponent {

  applicationName: string;
  applicationDescription: string;

  @Input() fsmContext: ApplicationWizardMachineContext;

  constructor(private fsm: AppplicationWizardMachineService,
              private w4cToscaTypeShortName: ToscaTypeShortNamePipe,
              private w4cToscaIdArchiveExtractor: ToscaIdArchiveExtractorPipe) { }

  ngOnInit() {
    if (this.fsmContext) {
      if (this.fsmContext.applicationName) {
        this.applicationName = this.fsmContext.applicationName;
      } else {
        // no applicationName is found in the context, let's pre-fill the applicationName using topology template name
        this.applicationName = this.w4cToscaTypeShortName.transform(this.w4cToscaIdArchiveExtractor.transform(this.fsmContext.templateId));
      }
      if (this.applicationDescription) {
        this.applicationDescription = this.fsmContext.applicationDescription;
      } else {
        // TODO: here pre-fill using topology template description
        this.applicationDescription = '';
      }
    }
  }

  createApp() {
    this.fsm.send(new DoCreateApplication(this.applicationName, this.applicationDescription));
  }

}
