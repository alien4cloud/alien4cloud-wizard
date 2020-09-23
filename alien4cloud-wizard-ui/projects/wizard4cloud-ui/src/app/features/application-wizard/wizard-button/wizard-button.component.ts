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

  onClick(event: any) {
    if (this.isEnabled()) {
      this.click.emit(event);
    } else {
      event.stopPropagation();
    }
  }

  isEnabled() : boolean {
    return WizardButtonComponent.isButtonUnabled(this.enabledFn, this.fsm, this.fsmContext, this.enableOnGuard);
  }

  public static isButtonUnabled(enabledFn: Function, fsm: AppplicationWizardMachineService, fsmContext: ApplicationWizardMachineContext, guardName: string) {
    let result = true;
    if (enabledFn) {
      // console.log("Calling backwardEnabledFn");
      result = enabledFn.call(this);
    }
    if (result && guardName) {
      result = WizardButtonComponent.callFsmGuard(fsm, fsmContext, guardName);
    }
    return result;
  }

  public static callFsmGuard(fsm: AppplicationWizardMachineService, fsmContext: ApplicationWizardMachineContext, guardName: string): boolean {
    if (!guardName) {
      // no guard is configured for this button, returning true
      return true;
    }
    if (!fsm.machineOptions.guards) {
      // console.log("No guards on FSM, returning true by default");
      return true;
    }
    if (!fsm.machineOptions.guards[guardName]) {
      // console.log(`No guards named ${guardName} on FSM, returning true by default`);
      return true;
    }
    try {
      let guardResult = fsm.machineOptions.guards[guardName].call(this, fsmContext);
      // console.log(`FSM guard ${guardName} returned ${guardResult}`);
      return guardResult;
    } catch (e) {
      console.error("Error occurred while using guard to enable/disable the button, returning true", e);
      return true;
    }
  }

  ngOnInit() {
  }

}
