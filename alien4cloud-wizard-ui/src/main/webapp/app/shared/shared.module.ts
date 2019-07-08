import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A4cThemeService } from './a4c-theming/a4c-theme.service';
import { MyCookieService } from './shared-cookie/mycookie.service';
import { CookieService } from 'ngx-cookie-service';
import { RestApiService } from './a4c-rest-api/rest-api.service';
import { A4cMaterialModule } from './a4c-material/a4c-material.module';

@NgModule({
  declarations: [],
  imports: [A4cMaterialModule, CommonModule],
  //entryComponents: [JhiLoginModalComponent],
  exports: [A4cMaterialModule,CommonModule],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
  providers: [
    MyCookieService,
    CookieService,
    RestApiService,
    A4cThemeService
  ],
})
export class SharedModule { 
  static forRoot() {
    return {
      ngModule: SharedModule
    };
  }
}
