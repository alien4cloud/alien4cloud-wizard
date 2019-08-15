import {Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {DoCancelWizard} from "@app/features/application-wizard/core/fsm.events";

/**
 * A control panel for the wizard.
 */
@Component({
  selector: 'w4c-wizard-control',
  templateUrl: './wizard-control.component.html',
  styleUrls: ['./wizard-control.component.css']
})
export class WizardControlComponent implements OnInit {

  @Input() fsmContext: ApplicationWizardMachineContext;

  @Input()
  public backwardFn: Function;

  @Input()
  public backwardGuard: string;

  @Input()
  public backwardAltLabel: string;

  @Input()
  public backwardEnabledFn: Function;

  @Input()
  public forwardFn: Function;

  @Input()
  public forwardGuard: string;

  @Input()
  public forwardAltLabel: string;

  @Input()
  public forwardEnabledFn: Function;

  @Input()
  public cancelEnabledFn: Function;

  constructor(private fsm: AppplicationWizardMachineService) { }

  ngOnInit() {
  }

  _backward() {
    this.backwardFn.call(this);
  }

  cancel() {
    this.fsm.send(new DoCancelWizard());
  }

  _forward() {
    this.forwardFn.call(this);
  }

  _forwardEnabled(): boolean {
    if (!this.forwardFn) {
      return false;
    } else if (this.forwardEnabledFn) {
      return this.forwardEnabledFn.call(this);
    } else {
      return true;
    }
  }

  _cancelEnabled(): boolean {
    if (this.cancelEnabledFn) {
      return this.cancelEnabledFn.call(this);
    } else {
      return true;
    }
  }

  _backwardEnabled(): boolean {
    if (!this.backwardFn) {
      return false;
    } else if (this.backwardEnabledFn) {
      return this.backwardEnabledFn.call(this);
    } else {
      return true;
    }
  }

}
