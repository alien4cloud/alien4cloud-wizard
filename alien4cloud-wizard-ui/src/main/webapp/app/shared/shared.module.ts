import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {A4cMaterialModule} from './a4c-material.module';
import {SvgNodeTypeImageSourceDirective} from './directives';
import {ToscaTypeShortNamePipe, ToscaTypeImageSrcPipe, ToscaIdArchiveExtractorPipe} from './pipes';
import {
  TopologyOverviewComponent
} from './components';
import {HeroLoaderModule} from "@herodevs/hero-loader";

/**
 * As it's name indicates, this is a shared module that embed all shared stuffs.
 * It should never import something in 'app/features' but should be imported by others feature modules.
 */
@NgModule({
  declarations: [
    TopologyOverviewComponent,
    ToscaTypeShortNamePipe,
    ToscaTypeImageSrcPipe,
    ToscaIdArchiveExtractorPipe,
    SvgNodeTypeImageSourceDirective
  ],
  imports: [
    A4cMaterialModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HeroLoaderModule
  ],
  exports: [
    A4cMaterialModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TopologyOverviewComponent,
    ToscaTypeShortNamePipe,
    ToscaTypeImageSrcPipe,
    ToscaIdArchiveExtractorPipe,
    SvgNodeTypeImageSourceDirective
  ],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
  providers: [ToscaTypeImageSrcPipe, ToscaIdArchiveExtractorPipe, ToscaTypeShortNamePipe],
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule
    };
  }
}
