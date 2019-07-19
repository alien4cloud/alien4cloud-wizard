import {Directive, NgModuleFactoryLoader, Renderer, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[w4cLoadModule]'
})
export class LoadModuleDirective {

  @Input('w4cLoadModule') modulePath: string;

  constructor(
    private element: ElementRef,
    private loader: NgModuleFactoryLoader,
    renderer: Renderer) {
    const unsubscribe = renderer.listen(element.nativeElement, 'click', (evt) => {
      this.loader.load(this.modulePath);
      unsubscribe();
    });
  }

}
