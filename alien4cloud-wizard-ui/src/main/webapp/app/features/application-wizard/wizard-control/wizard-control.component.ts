import {Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";

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

  constructor() { }

  ngOnInit() {
  }

  public _backward() {
    this.backwardFn.call(this);
  }

  public _forward() {
    this.forwardFn.call(this);
  }

  public _forwardEnabled(): boolean {
    if (this.forwardEnabledFn) {
      return this.forwardEnabledFn.call(this);
    } else {
      return true;
    }
  }

  public _backwardEnabled(): boolean {
    if (this.backwardEnabledFn) {
      return this.backwardEnabledFn.call(this);
    } else {
      return true;
    }
  }

}
