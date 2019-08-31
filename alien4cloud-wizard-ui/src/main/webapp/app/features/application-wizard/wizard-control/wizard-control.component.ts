import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {DoCancelWizard, GoBack} from "@app/features/application-wizard/core/fsm.events";
import {WizardButtonComponent} from "@app/features/application-wizard/wizard-button/wizard-button.component";

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

  _backward(event: any) {
    event.stopPropagation();
    if (!this._backwardEnabled()) {
      return;
    }
    if (this.backwardFn) {
      this.backwardFn.call(this);
    } else {
      // default behavior for Back button is to send a GoBack event.
      this.fsm.send(new GoBack());
    }
  }

  _cancel(event: any) {
    event.stopPropagation();
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
    event.stopPropagation();
    if (!this._forwardEnabled()) {
      return;
    }
    this.forwardFn.call(this, event);
  }

  _forwardEnabled(): boolean {
    if (!this.forwardFn) {
      return false;
    }
    return WizardButtonComponent.isButtonUnabled(this.forwardEnabledFn, this.fsm, this.fsmContext, this.forwardGuard);
  }

  _cancelEnabled(): boolean {
    return WizardButtonComponent.isButtonUnabled(this.cancelEnabledFn, this.fsm, this.fsmContext, this.cancelGuard);
  }

  _backwardEnabled(): boolean {
    // console.log(" backwardEnabledFn is ", JSON.stringify(this.backwardEnabledFn));
    if (!this.displayBackward) {
      return false;
    }
    return WizardButtonComponent.isButtonUnabled(this.backwardEnabledFn, this.fsm, this.fsmContext, this.backwardGuard);
  }



}
