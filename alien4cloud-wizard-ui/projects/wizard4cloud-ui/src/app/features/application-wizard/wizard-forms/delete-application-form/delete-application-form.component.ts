import {Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {DoDeleteApplication} from "@app/features/application-wizard/core/fsm.events";
import {WizardFormComponent} from "@app/features/application-wizard/core/wizard.model";
import { MatDialog } from '@angular/material';
import {TranslateService} from "@ngx-translate/core";
import {ConfirmationDialogComponent} from "@alien4cloud/wizard4cloud-commons";


@Component({
  selector: 'w4c-delete-application-form',
  templateUrl: './delete-application-form.component.html',
  styleUrls: ['./delete-application-form.component.css']
})
export class DeleteApplicationFormComponent extends WizardFormComponent {

  constructor(
    protected fsm: AppplicationWizardMachineService,
    private  dialog: MatDialog,
    private translate: TranslateService
  ) { super(fsm); }

  openDialog(event: any): void {
    event.stopPropagation();
    const title = this.translate.instant("Wizard.Forms.DeleteApplicationFormComponent.DeleteDialog.Title");
    const msg = this.translate.instant("Wizard.Forms.DeleteApplicationFormComponent.DeleteDialog.Message", {applicationName: this.fsmContext.application.name});
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '35%',
      data: {
        actionDescription: title,
        message: msg
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.fsm.send(new DoDeleteApplication());
      }
    });
  }

}
