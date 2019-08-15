import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsComponent} from '../settings/settings.component';
import {SharedModule} from "@app/shared";
import {SettingsRoutingModule} from "@app/features/settings/settings-routing.module";

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    SharedModule,
    SettingsRoutingModule,
    CommonModule
  ]
})
export class SettingsModule { }
