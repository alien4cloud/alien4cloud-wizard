import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {DoCancelWizard, GoBack} from "@app/features/application-wizard/core/fsm.events";

/**
 * A control panel for the wizard.
 */
@Component({
  selector: 'w4c-wizard-control',
  templateUrl: './wizard-control.component.html',
  styleUrls: ['./wizard-control.component.css']
})
export class WizardControlComponent implements OnInit {

  @Input()
  fsmContext: ApplicationWizardMachineContext;

  @Input()
  buttonHookTemplate: TemplateRef<any>;

  @Input()
  displayBackward: boolean = true;

  @Input()
  backwardFn: Function;

  @Input()
  backwardGuard: string;

  @Input()
  backwardAltLabel: string;

  @Input()
  backwardEnabledFn: Function;

  @Input()
  forwardFn: Function;

  @Input()
  forwardGuard: string;

  @Input()
  forwardAltLabel: string;

  @Input()
  forwardEnabledFn: Function;

  @Input()
  cancelFn: Function;

  @Input()
  cancelGuard: string;

  @Input()
  cancelEnabledFn: Function;

  @Input()
  cancelLabel: string;

  constructor(private fsm: AppplicationWizardMachineService) { }

  ngOnInit() {
  }

  _backward() {
    if (this._backwardEnabled()) {
      if (this.backwardFn) {
        this.backwardFn.call(this);
      } else {
        // default behavior for Back button is to send a GoBack event.
        this.fsm.send(new GoBack());
      }
    }
  }

  _cancel(event: any) {
    if (!this._cancelEnabled()) {
      return;
    }
    if (this.cancelFn) {
      this.cancelFn.call(this, event);
    } else {
      // default behavior for Cancel button is to send a DoCancelWizard event.
      this.fsm.send(new DoCancelWizard());
    }
  }

  _forward(event: any) {
    if (this._forwardEnabled()) {
      this.forwardFn.call(this, event);
    }
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
    if (!this.displayBackward) {
      return false;
    } else if (this.backwardEnabledFn) {
      return this.backwardEnabledFn.call(this);
    } else {
      return true;
    }
  }

}
