import {Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {DoCreateApplication, GoBack} from "@app/features/application-wizard/core/fsm.events";
import {ToscaIdArchiveExtractorPipe, ToscaTypeShortNamePipe, TrimNamePipe} from "@app/shared";
import {WizardFormComponent} from "@app/features/application-wizard/wizard-main/wizard-main.model";


@Component({
  selector: 'w4c-application-create',
  templateUrl: './application-create.component.html',
  styleUrls: ['./application-create.component.css']
})
export class ApplicationCreateComponent implements OnInit, WizardFormComponent {

  applicationName: string;
  applicationDescription: string;

  @Input() fsmContext: ApplicationWizardMachineContext;

  constructor(private fsm: AppplicationWizardMachineService,
              private w4cToscaTypeShortName: ToscaTypeShortNamePipe,
              private w4cToscaIdArchiveExtractor: ToscaIdArchiveExtractorPipe,
              private trimName: TrimNamePipe) { }

  ngOnInit() {
    // console.log("is back possible ? ", this.fsm.machineOptions.guards['backIsPossible'].call(this.fsmContext));

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
        // pre-fill using topology template description
        this.applicationDescription = this.fsmContext.templateDescription;
      }
    }
  }

  createApp() {
    this.fsm.send(new DoCreateApplication(this.trimName.transform(this.applicationName), this.applicationDescription));
  }

  back() {

    this.fsm.send(new GoBack());
  }

}
