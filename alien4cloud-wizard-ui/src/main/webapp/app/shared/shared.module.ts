import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A4cMaterialModule } from './a4c-material.module';

@NgModule({
  declarations: [],
  imports: [A4cMaterialModule, CommonModule],
  //entryComponents: [JhiLoginModalComponent],
  exports: [A4cMaterialModule, CommonModule],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
  providers: [],
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule
    };
  }
}
