import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
// Forms module
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';


import {AppComponent} from './app.component';
import {
  FooterComponent,
  LHeaderComponent,
  HomeComponent,
  SharedModule
} from './shared';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {A4cMaterialModule} from '@app/shared';
import {OverlayContainer} from '@angular/cdk/overlay';
import {AppRoutingModule, routingComponents} from './app-routing.module';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {AuthInterceptor, StyleManager} from '@app/core';
import {HeroLoaderModule} from "@herodevs/hero-loader";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {CookieService} from "ngx-cookie-service";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LHeaderComponent,
    FooterComponent,
    HomeComponent,
    // StatusComponent,
    routingComponents
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
    SharedModule.forRoot(),
    NgxWebstorageModule.forRoot({prefix: 'w4c', separator: '-'}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    HeroLoaderModule
  ],
  exports: [
    A4cMaterialModule,
    SharedModule,
    HeroLoaderModule
  ],
  providers: [
    OverlayContainer,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(overlayContainer: OverlayContainer) {
    // overlayContainer.getContainerElement().classList.add('solution-dark-theme');
  }
}
