import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
// Forms module
import { FormsModule } from '@angular/forms';
import { RestApiService } from './shared/a4c-rest-api/rest-api.service';
import { MyCookieService } from './shared/shared-cookie/mycookie.service';
import { FlexLayoutModule } from '@angular/flex-layout';
//import { MatTabsModule } from '@angular/material/tabs';
//import { StatusComponent } from './test/status/status.component';
import { HomeModule } from './home/home.module';
//import { HeaderComponent } from './layouts/header/header.component';

import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
//import { NoopAnimationsModule} from '@angular/platform-browser/animations';

import { ReactiveFormsModule } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';

import {A4cMaterialModule} from './shared/a4c-material/a4c-material.module';
import { HeaderComponent } from './layouts/header/header.component';
import { A4cThemeService} from './shared/a4c-theming/a4c-theme.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MainComponent } from './layouts/main/main.component';
import { SharedModule } from './shared/shared.module';
import { AppsComponent } from './layouts/apps/apps.component';
import { AppsService } from './layouts/apps/apps.service';


@NgModule({
  declarations: [
    //AppComponent
   // StatusComponent,
    HeaderComponent,
    AppsComponent,

  MainComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    FlexLayoutModule,
    A4cMaterialModule,
    BrowserAnimationsModule, 
  //  NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HomeModule,
    SharedModule.forRoot()

  ],
  exports: [
    A4cMaterialModule
  ],
  providers: [
    MyCookieService,
    CookieService,
    RestApiService,
    A4cThemeService,
    OverlayContainer,
    AppsService
  ],
  bootstrap: [MainComponent]
})
export class AppModule {
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('solution-dark-theme');
  }
 }
