import {AfterContentInit, Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {DoCreateApplication, DoUpdateApplication, GoBack} from "@app/features/application-wizard/core/fsm.events";
import {ToscaIdArchiveExtractorPipe, ToscaTypeShortNamePipe, TrimNamePipe} from "@app/shared";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import * as _ from "lodash";
import {WizardFormComponent} from "@app/features/application-wizard/core/wizard.model";

@Component({
  selector: 'w4c-application-create',
  templateUrl: './application-create.component.html',
  styleUrls: ['./application-create.component.css']
})
export class ApplicationCreateComponent implements OnInit, WizardFormComponent, AfterContentInit {

  // applicationName: string;
  public applicationNameFormCtrl: FormControl = new FormControl();
  public archiveName: string;
  public applicationDescription: string;


  @Input() fsmContext: ApplicationWizardMachineContext;

  constructor(private fsm: AppplicationWizardMachineService,
              private w4cToscaTypeShortName: ToscaTypeShortNamePipe,
              private w4cToscaIdArchiveExtractor: ToscaIdArchiveExtractorPipe,
              private trimName: TrimNamePipe) { }

  ngOnInit() {
    this.applicationNameFormCtrl.valueChanges.pipe(debounceTime(500)).subscribe(value => {
      if (!this.fsmContext.application) {
        // The archive name can not be changed for an existing application
        this.archiveName = _.capitalize(_.camelCase(value));
      }
    });
  }

  ngAfterContentInit(): void {
    if (this.fsmContext.application) {
      this.applicationNameFormCtrl.setValue(this.fsmContext.application.name);
      this.applicationDescription = this.fsmContext.application.description;
    } else {
      // no applicationName is found in the context, let's pre-fill the applicationName using topology template name
      this.applicationNameFormCtrl.setValue("MyApp" + this.w4cToscaTypeShortName.transform(this.w4cToscaIdArchiveExtractor.transform(this.fsmContext.topologyTemplate.id)));
      // pre-fill using topology template description
      this.applicationDescription = this.fsmContext.topologyTemplate.description;
    }
  }

  createApp() {
    if (this.fsmContext.application) {
      this.fsm.send(new DoUpdateApplication(this.fsmContext.application.id, this.applicationNameFormCtrl.value, this.applicationDescription));
    } else {
      this.fsm.send(new DoCreateApplication(this.applicationNameFormCtrl.value, this.applicationDescription, this.archiveName));
    }
  }

}
