import {NgModule} from '@angular/core';
import {LoginComponent} from "./login.component";
import {LoginRoutingModule} from "./login-routing.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {W4cMaterialModule} from "../../shared/w4c-material.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    LoginRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    W4cMaterialModule,
    TranslateModule.forChild()
  ]
})

export class LoginModule {
}
