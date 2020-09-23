import {NgModule} from '@angular/core';
import {LoginModule} from "@alien4cloud/wizard4cloud-commons";

@NgModule({
  imports: [
    LoginModule,
  ]
})
/**
 * We need this wrapper in order to lazy load LoginComponent in app-routing.module.
 */
export class LoginWrapperModule {}
