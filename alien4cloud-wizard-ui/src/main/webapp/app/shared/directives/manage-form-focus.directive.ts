import {Directive, ElementRef, Input, OnInit, Renderer} from '@angular/core';
import {FormGroup} from "@angular/forms";
import * as _ from "lodash";

/**
 * Manage the focus for each elements of a form.
 * When you press, Tab or Shift Tab on a form control, you want that the next form get the focus (an not the button at the right of the inputs).
 */
@Directive({
  selector: '[w4cManageFormFocus]'
})
export class ManageFormFocusDirective implements OnInit {

  @Input("w4cManageFormFocus") formGroup: FormGroup;

  /**
   * An array of form controls IDs.
   */
  private formControls: string[];

  constructor(private elementRef: ElementRef, private renderer: Renderer) { }

  ngOnInit(): void {
    this.renderer.listen(this.elementRef.nativeElement, "keydown", (event) => {
      this.keyDown(event);
    });
  }

  keyDown(event: any) {
    if (event.code == "Tab") {
      if (event.shiftKey) {
        this.focusPrevious(event);
      } else {
        this.focusNext(event);
      }
    }
  }

  /**
   * We cache the form controls IDs of this form, the array is built during first call.
   * So we don't manage form that are dynamics, but don't need for this, KISS.
   */
  getFormControlIDs(): string[] {
    if (this.formControls) {
      return this.formControls;
    } else {
      this.formControls = new Array();
      _.forEach(this.formGroup.controls, (value, key) => {
        this.formControls.push(key);
      });
      return this.formControls;
    }
  }

  getCurrentControlIndex(formControlIDs: string[], elementId: string): number {
    // find the current form control index (where the key event occured)
    // sometimes (for example toggle sliders, the event occured on ....-input
    // that's why we also consider -input suffixe
    return _.findIndex(formControlIDs, (key) => key == elementId || (key + "-input") == elementId);
  }

  focusNext(event: any) {
    event.stopPropagation();
    console.log("Focus next event: ", JSON.stringify(event));
    console.log("Focus next event source: ", JSON.stringify(event.srcElement.id));

    let formControlIDs = this.getFormControlIDs();
    let ctrlIdx = this.getCurrentControlIndex(formControlIDs, event.srcElement.id);

    if (ctrlIdx > -1) {
      console.log(`Current control index is ${ctrlIdx} key: ${event.srcElement.id}`);
      let nextCtrlIndex = ctrlIdx + 1;
      if (nextCtrlIndex == formControlIDs.length) {
        nextCtrlIndex = 0;
      }
      console.log(`Next control index is ${nextCtrlIndex} key: ${formControlIDs[nextCtrlIndex]}`);
      this.focusTo(formControlIDs[nextCtrlIndex]);
    } else {
      console.log("The current form control can not be identified");
    }
  }

  focusTo(elementId: string) {
    console.log("Focusing to : ", elementId);
    setTimeout(() => this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#' + elementId), 'focus', []), 100);
  }

  focusPrevious(event: any) {
    event.stopPropagation();
    console.log("Focus previous event: ", JSON.stringify(event));
    console.log("Focus previous event target: ", JSON.stringify(event.target));

    let formControlIDs = this.getFormControlIDs();
    let ctrlIdx = this.getCurrentControlIndex(formControlIDs, event.srcElement.id);

    if (ctrlIdx > -1) {
      console.log(`Current control index is ${ctrlIdx} key: ${event.srcElement.id}`);
      let previousCtrlIndex = ctrlIdx - 1;
      if (previousCtrlIndex < 0) {
        previousCtrlIndex = formControlIDs.length -1;
      }
      console.log(`Previous control index is ${previousCtrlIndex} key: ${formControlIDs[previousCtrlIndex]}`);
      this.focusTo(formControlIDs[previousCtrlIndex]);
    } else {
      console.log("The current form control can not be identified");
    }
  }

}
