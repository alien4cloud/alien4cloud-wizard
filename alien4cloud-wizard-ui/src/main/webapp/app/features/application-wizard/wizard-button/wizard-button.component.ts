import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";

/**
 * This button activation is driven by a FSM guard. Just use it as a normal button but :
 * <ul>
 *  <li>Inject the current FSM context using the <code>fsmContext</code> input.
 *  <li>Define the name of the guard to be called using <code>enableOnGuard</code> input. Should be a guard accepting only the context as arg.
 * </ul>
 */
@Component({
  selector: 'w4c-wizard-button',
  templateUrl: './wizard-button.component.html',
  styleUrls: ['./wizard-button.component.css']
})
export class WizardButtonComponent implements OnInit {

  @Input() fsmContext: ApplicationWizardMachineContext;

  /**
   * The name of the guard we want to use to activate this button or not.
   */
  @Input() enableOnGuard: string;

  @Input() enabledFn: Function;

  /**
   * The label of the button.
   */
  @Input() label: string;
  @Output() click: EventEmitter<any> = new EventEmitter<any>();

  @Input() matIconName: string;

  /**
   * If true, the optional mat-icon will be at the right of the button, otherwise (default) at the left.
   */
  @Input() matIconAtEnd:  boolean;

  constructor(public fsm: AppplicationWizardMachineService) { }

  isEnabled() : boolean {
    let enabledFnResult = true;
    if (this.enabledFn) {
      enabledFnResult = this.enabledFn.call(this);
    }
    if (!enabledFnResult) {
      return false;
    }
    let guardResult = true;
    if (this.enableOnGuard) {
      try {
        if (this.fsmContext && this.fsm.machineOptions && this.fsm.machineOptions.guards && this.fsm.machineOptions.guards[this.enableOnGuard]) {
          guardResult = this.fsm.machineOptions.guards[this.enableOnGuard].call(this, this.fsmContext);
        }
      } catch (e) {
        console.error("Error occurred while using guard to enable/disable the button", e);
      }
    }
    return guardResult;
  }

  ngOnInit() {
  }

}
