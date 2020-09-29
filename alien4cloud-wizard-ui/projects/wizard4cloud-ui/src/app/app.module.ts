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
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {HomeComponent, SharedModule} from '@app/shared';
import {OverlayContainer} from '@angular/cdk/overlay';
import {AppRoutingModule, routingComponents} from './app-routing.module';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {HeroLoaderModule} from "@herodevs/hero-loader";
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy} from "@angular/common";
import {CookieService} from "ngx-cookie-service";
import {W4cMaterialModule} from "@alien4cloud/wizard4cloud-commons";
import {AuthInterceptor} from "@alien4cloud/wizard4cloud-commons";
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "@alien4cloud/wizard4cloud-commons/lib/core/models/commons.model";
import {MultiTranslateHttpLoader} from "ngx-translate-multi-http-loader";

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    {prefix: "./assets/i18n/", suffix: ".json"},
    {prefix: "./assets/i18n/addons-", suffix: ".json"},
  ]);
}

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    FlexLayoutModule,
    W4cMaterialModule,
    BrowserAnimationsModule,
    //  NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
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
    W4cMaterialModule,
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
      provide: APP_BASE_HREF,
      useValue: window['base-href']
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
