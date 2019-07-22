import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[w4cStepComponent]'
})
export class StepComponentDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
