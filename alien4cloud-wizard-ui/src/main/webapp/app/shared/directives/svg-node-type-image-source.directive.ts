import {Directive, ElementRef, Renderer2, Input, OnInit} from '@angular/core';
import {NodeType} from "@app/core";
import {ToscaTypeImageSrcPipe} from "@app/shared/pipes";

/**
 * Given a NodeType, set an attribute of type xlink:href="api/img?id=..." for a svg image.
 * This is used in svg template to display components' images.
 */
@Directive({
  selector: '[w4cSvgNoteTypeImageSource]'
})
export class SvgNodeTypeImageSourceDirective implements OnInit {

  @Input('w4cSvgNoteTypeImageSource') nodeType: NodeType;

  constructor(private el: ElementRef, private renderer: Renderer2, private pipe: ToscaTypeImageSrcPipe) {
  }

  ngOnInit(): void {
    this.renderer.setAttribute(this.el.nativeElement, "href", this.pipe.transform(this.nodeType), "xlink");
  }

}
