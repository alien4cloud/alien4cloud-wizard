import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {A4cMaterialModule} from './a4c-material.module';
import {SvgNodeTypeImageSourceDirective} from './directives';
import {ToscaTypeShortNamePipe, ToscaTypeImageSrcPipe, ToscaIdArchiveExtractorPipe, TrimNamePipe, DeploymentStatusButtonLabel} from './pipes';
import {
  LoginComponent,
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
    LoginComponent,
    ToscaTypeShortNamePipe,
    ToscaTypeImageSrcPipe,
    ToscaIdArchiveExtractorPipe,
    SvgNodeTypeImageSourceDirective,
    TrimNamePipe,
    DeploymentStatusButtonLabel
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
    LoginComponent,
    ToscaTypeShortNamePipe,
    ToscaTypeImageSrcPipe,
    ToscaIdArchiveExtractorPipe,
    SvgNodeTypeImageSourceDirective,
    TrimNamePipe,
    DeploymentStatusButtonLabel
  ],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
  providers: [ToscaTypeImageSrcPipe, ToscaIdArchiveExtractorPipe, ToscaTypeShortNamePipe, TrimNamePipe, DeploymentStatusButtonLabel],
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule
    };
  }
}
