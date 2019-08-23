import {Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {DoDeleteApplication} from "@app/features/application-wizard/core/fsm.events";
import {WizardFormComponent} from "@app/features/application-wizard/core/wizard.model";
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '@app/shared';


@Component({
  selector: 'w4c-delete-application-form',
  templateUrl: './delete-application-form.component.html',
  styleUrls: ['./delete-application-form.component.css']
})
export class DeleteApplicationFormComponent extends WizardFormComponent {

  constructor(
    protected fsm: AppplicationWizardMachineService,
    private  dialog: MatDialog
  ) { super(fsm); }

  openDialog(event: any): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '35%',
      data: {
        actionDescription :"Application deletion",
        message: "Do you confirm the deletion of this application?"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.fsm.send(new DoDeleteApplication());
      }
    });
  }

}
