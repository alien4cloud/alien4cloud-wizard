import {CUSTOM_ELEMENTS_SCHEMA, Injectable, InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {HeroLoaderModule} from "@herodevs/hero-loader";
import {TranslateModule} from "@ngx-translate/core";
import {W4cMaterialModule} from "./w4c-material.module";
import {ConfirmationDialogComponent} from "./components/confirmation-dialog/confirmation-dialog.component";
import {LHeaderComponent} from "./layout/header.component";
import {FooterComponent} from "./layout/footer.component";
import {StyleManager} from "../core/services/style-manager";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "../core/interceptors/authentication.interceptor";
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "../core/models/commons.model";

export function getBootstrapSettings(): BootstrapSettings {
  return { production: window['bootstrapSettings'].production, urlPrefix: window['bootstrapSettings'].urlPrefix };
}

/**
 * As it's name indicates, this is a shared module that embed all shared stuffs.
 * It should never import something in 'app/features' but should be imported by others feature modules.
 */
@NgModule({
  declarations: [
    LHeaderComponent,
    FooterComponent,
/*
    PropertyEditorComponent,
    ToscaTypeShortNamePipe,
    ToscaIdArchiveExtractorPipe,
    ManageFormFocusDirective,
*/
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HeroLoaderModule,
    W4cMaterialModule,
    TranslateModule.forChild()
  ],
  exports: [
    LHeaderComponent,
    FooterComponent,
    ConfirmationDialogComponent,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
/*    PropertyEditorComponent,
    ToscaTypeShortNamePipe,
    ToscaIdArchiveExtractorPipe,
    ManageFormFocusDirective,*/
    TranslateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
/*    ToscaIdArchiveExtractorPipe,
    ToscaTypeShortNamePipe,*/
    StyleManager,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: BOOTSTRAP_SETTINGS, useFactory: getBootstrapSettings}
/*    {provide: WindowWrapper, useFactory: getWindow}*/
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ]
})
export class W4cCommonsModule {
/*  static forRoot(environmentConfig: EnvironmentConfig): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        { provide: EnvironmentConfig, useValue: environmentConfig }
      ]
    };
  }*/
  static forRoot() {
    return {
      ngModule: W4cCommonsModule
    };
  }
}
