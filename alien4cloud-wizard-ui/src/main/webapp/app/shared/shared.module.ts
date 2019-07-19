import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
// import { NgxGraphModule } from '@swimlane/ngx-graph';
// import { NgxChartsModule } from '@swimlane/ngx-charts';

import { A4cMaterialModule } from './a4c-material.module';
import { LoadModuleDirective, SvgNodeTypeImageSourceDirective } from './directives';
import { ToscaTypeShortNamePipe, ToscaTypeImageSrcPipe } from './pipes';
import {
  TopologyOverviewComponent
} from './components';

@NgModule({
  declarations: [
    TopologyOverviewComponent,
    ToscaTypeShortNamePipe,
    ToscaTypeImageSrcPipe,
    LoadModuleDirective,
    SvgNodeTypeImageSourceDirective
  ],
  imports: [
    A4cMaterialModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  //entryComponents: [JhiLoginModalComponent],
  exports: [
    A4cMaterialModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TopologyOverviewComponent,
    ToscaTypeShortNamePipe,
    ToscaTypeImageSrcPipe,
    LoadModuleDirective,
    SvgNodeTypeImageSourceDirective
  ],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
  providers: [ToscaTypeImageSrcPipe],
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule
    };
  }
}
