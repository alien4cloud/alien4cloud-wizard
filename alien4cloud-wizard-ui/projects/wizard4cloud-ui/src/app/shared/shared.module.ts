import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {SvgNodeTypeImageSourceDirective} from './directives';
import {
  DeploymentStatusButtonLabel,
  FilterTopologyNodesAttributesPipe,
  FilterTopologyNodesPipe,
  ToscaIdArchiveExtractorPipe,
  ToscaTypeImageSrcPipe,
  ToscaTypeShortNamePipe
} from './pipes';
import {TopologyOverviewComponent,} from './components';
import {HeroLoaderModule} from "@herodevs/hero-loader";
import {ManageFormFocusDirective} from "@app/shared/directives/manage-form-focus.directive";
import {NgxGraphModule} from "@swimlane/ngx-graph";
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {TopologyGraphViewerComponent} from "@app/shared/components/topology-graph-viewer/topology-graph-viewer.component";
import {WorkflowGraphViewerComponent} from "@app/shared/components/workflow-graph-viewer/workflow-graph-viewer.component";
import {FilteredSearchBarComponent} from "@app/shared/components/filtered-search-bar/filtered-search-bar.component";
import {TranslateModule} from "@ngx-translate/core";
import {PropertyEditorComponent} from "@app/shared/components/property-editor/property-editor.component";
import {WizardRedirectionProviderService} from "@app/core/services/redirection-provider-service";
import {REDIRECTION_PROVIDER, W4cCommonsModule, W4cMaterialModule} from "@alien4cloud/wizard4cloud-commons";
import { ClipboardButtonComponent } from './components/clipboard-button/clipboard-button.component';
import { TemplatePropertiesEditorComponent } from './components/template-properties-editor/template-properties-editor.component';
import { ListPropertyEditorComponent } from './components/list-property-editor/list-property-editor.component';
import { PropertyFormDialogComponent } from './components/property-form-dialog/property-form-dialog.component';
import {ConfirmationDialogComponent} from "../../../../wizard4cloud-commons/src/lib/shared/components/confirmation-dialog/confirmation-dialog.component";
import { DeploymentValidationComponent } from './components/deployment-validation-tasks/deployment-validation.component';
import { EmphasePipe } from './pipes/emphase.pipe';

/**
 * As it's name indicates, this is a shared module that embed all shared stuffs.
 * It should never import something in 'app/features' but should be imported by others feature modules.
 */
@NgModule({
  declarations: [
    TopologyOverviewComponent,
    TopologyGraphViewerComponent,
    WorkflowGraphViewerComponent,
    FilteredSearchBarComponent,
    PropertyEditorComponent,
    ToscaTypeShortNamePipe,
    ToscaTypeImageSrcPipe,
    ToscaIdArchiveExtractorPipe,
    FilterTopologyNodesPipe,
    FilterTopologyNodesAttributesPipe,
    SvgNodeTypeImageSourceDirective,
    ManageFormFocusDirective,
    DeploymentStatusButtonLabel,
    ClipboardButtonComponent,
    TemplatePropertiesEditorComponent,
    ListPropertyEditorComponent,
    PropertyFormDialogComponent,
    DeploymentValidationComponent,
    EmphasePipe
  ],
  imports: [
    W4cMaterialModule,
    W4cCommonsModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HeroLoaderModule,
    NgxGraphModule,
    NgxChartsModule,
    TranslateModule.forChild()
  ],
  exports: [
    W4cMaterialModule,
    W4cCommonsModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TopologyOverviewComponent,
    TopologyGraphViewerComponent,
    ClipboardButtonComponent,
    WorkflowGraphViewerComponent,
    FilteredSearchBarComponent,
    PropertyEditorComponent,
    ToscaTypeShortNamePipe,
    ToscaTypeImageSrcPipe,
    ToscaIdArchiveExtractorPipe,
    FilterTopologyNodesPipe,
    FilterTopologyNodesAttributesPipe,
    SvgNodeTypeImageSourceDirective,
    ManageFormFocusDirective,
    DeploymentStatusButtonLabel,
    TranslateModule,
    TemplatePropertiesEditorComponent,
    DeploymentValidationComponent
  ],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
  providers: [
    ToscaTypeImageSrcPipe,
    ToscaIdArchiveExtractorPipe,
    ToscaTypeShortNamePipe,
    DeploymentStatusButtonLabel,
    FilterTopologyNodesPipe,
    FilterTopologyNodesAttributesPipe,
    {
      provide: REDIRECTION_PROVIDER,
      useClass: WizardRedirectionProviderService
    }
  ],
  entryComponents: [
    PropertyFormDialogComponent
  ],
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule
    };
  }
}
