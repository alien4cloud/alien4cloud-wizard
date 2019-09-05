import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {A4cMaterialModule} from './a4c-material.module';
import {SvgNodeTypeImageSourceDirective} from './directives';
import {ToscaTypeShortNamePipe, ToscaTypeImageSrcPipe, ToscaIdArchiveExtractorPipe, TrimNamePipe, DeploymentStatusButtonLabel, FilterTopologyNodesPipe , FilterTopologyNodesAttributesPipe, SplitAndGetPipe} from './pipes';
import {
  LoginComponent,
  TopologyOverviewComponent,
  ConfirmationDialogComponent
} from './components';
import {HeroLoaderModule} from "@herodevs/hero-loader";
import {PropertyEditorComponent} from "@app/shared/components/property-editor/property-editor.component";
import {StyleManager} from "@app/core";
import {ManageFormFocusDirective} from "@app/shared/directives/manage-form-focus.directive";
import {NgxGraphModule} from "@swimlane/ngx-graph";
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {TopologyGraphViewerComponent} from "@app/shared/components/topology-graph-viewer/topology-graph-viewer.component";
import {WorkflowGraphViewerComponent} from "@app/shared/components/workflow-graph-viewer/workflow-graph-viewer.component";
import {FilteredSearchBarComponent} from "@app/shared/components/filtered-search-bar/filtered-search-bar.component";

/**
 * As it's name indicates, this is a shared module that embed all shared stuffs.
 * It should never import something in 'app/features' but should be imported by others feature modules.
 */
@NgModule({
  declarations: [
    TopologyOverviewComponent,
    TopologyGraphViewerComponent,
    WorkflowGraphViewerComponent,
    PropertyEditorComponent,
    FilteredSearchBarComponent,
    LoginComponent,
    ToscaTypeShortNamePipe,
    ToscaTypeImageSrcPipe,
    ToscaIdArchiveExtractorPipe,
    FilterTopologyNodesPipe,
    FilterTopologyNodesAttributesPipe,
    SplitAndGetPipe,
    SvgNodeTypeImageSourceDirective,
    ManageFormFocusDirective,
    TrimNamePipe,
    DeploymentStatusButtonLabel,
    ConfirmationDialogComponent
  ],
  imports: [
    A4cMaterialModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HeroLoaderModule,
    NgxGraphModule,
    NgxChartsModule,
  ],
  exports: [
    A4cMaterialModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TopologyOverviewComponent,
    TopologyGraphViewerComponent,
    WorkflowGraphViewerComponent,
    FilteredSearchBarComponent,
    PropertyEditorComponent,
    LoginComponent,
    ToscaTypeShortNamePipe,
    ToscaTypeImageSrcPipe,
    ToscaIdArchiveExtractorPipe,
    FilterTopologyNodesPipe,
    FilterTopologyNodesAttributesPipe,
    SplitAndGetPipe,
    SvgNodeTypeImageSourceDirective,
    ManageFormFocusDirective,
    TrimNamePipe,
    DeploymentStatusButtonLabel
  ],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
  providers: [ToscaTypeImageSrcPipe, ToscaIdArchiveExtractorPipe, ToscaTypeShortNamePipe, TrimNamePipe, DeploymentStatusButtonLabel, StyleManager, FilterTopologyNodesPipe, FilterTopologyNodesAttributesPipe, SplitAndGetPipe],
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule
    };
  }
}
