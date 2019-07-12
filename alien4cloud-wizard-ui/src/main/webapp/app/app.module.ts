import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// Forms module
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeModule } from '@app/home';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import {A4cMaterialModule,SharedModule} from '@app/shared';
import { HeaderComponent,MainComponent,ApplicationDetailsComponent} from '@app/layouts';
import { A4cThemeService, MetapropertyService,ApplicationsService,MyCookieService} from '@app/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AppRoutingModule,routingComponents} from './app-routing.module';


@NgModule({
  declarations: [
    //AppComponent
   // StatusComponent,
    HeaderComponent,
  

  MainComponent,

  //ModulesComponent,
  //ApplicationsComponent,
  // ImportsComponent
  routingComponents,

  ApplicationDetailsComponent
],
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
    A4cThemeService,
    OverlayContainer,
    ApplicationsService,
    MetapropertyService
  ],
  bootstrap: [MainComponent]
})
export class AppModule {
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('solution-dark-theme');
  }
 }
