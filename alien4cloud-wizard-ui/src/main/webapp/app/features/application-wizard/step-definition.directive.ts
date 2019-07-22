import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {NodeType} from "@app/core";
import {WizardFormStep} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.schema";

@Directive({
  selector: '[w4cStepDefinition]'
})
export class StepDefinitionDirective implements OnInit {

  @Input('w4cStepDefinition') step: WizardFormStep;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.renderer.setAttribute(this.el.nativeElement, "editable", (this.step.editable)?"true":"false");
    this.renderer.setAttribute(this.el.nativeElement, "completed", (this.step.editable)?"true":"false");
  }


}
