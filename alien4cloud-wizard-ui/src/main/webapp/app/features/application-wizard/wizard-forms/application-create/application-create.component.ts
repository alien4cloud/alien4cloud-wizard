import {AfterContentInit, Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {DoCreateApplication, GoBack} from "@app/features/application-wizard/core/fsm.events";
import {ToscaIdArchiveExtractorPipe, ToscaTypeShortNamePipe, TrimNamePipe} from "@app/shared";
import {WizardFormComponent} from "@app/features/application-wizard/wizard-main/wizard-main.model";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import * as _ from "lodash";

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
      this.archiveName = _.capitalize(_.camelCase(value));
    });
  }

  ngAfterContentInit(): void {
    if (this.fsmContext.applicationName) {
      this.applicationNameFormCtrl.setValue(this.fsmContext.applicationName);
    } else {
      // no applicationName is found in the context, let's pre-fill the applicationName using topology template name
      this.applicationNameFormCtrl.setValue("MyApp" + this.w4cToscaTypeShortName.transform(this.w4cToscaIdArchiveExtractor.transform(this.fsmContext.topologyTemplate.id)));
    }
    if (this.fsmContext.applicationDescription) {
      this.applicationDescription = this.fsmContext.applicationDescription;
    } else {
      // pre-fill using topology template description
      this.applicationDescription = this.fsmContext.topologyTemplate.description;
    }
  }

  createApp() {
    this.fsm.send(new DoCreateApplication(this.applicationNameFormCtrl.value, this.applicationDescription, this.archiveName));
  }

  back() {
    this.fsm.send(new GoBack());
  }

}
