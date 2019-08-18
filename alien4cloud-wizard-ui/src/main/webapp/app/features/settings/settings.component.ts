import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {SettingsService, PropertyDefinition, Setting, AbstractPropertyValue, ScalarPropertyValue} from "@app/core";

@Component({
  selector: 'w4c-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  /** The form. */
  settingsForm = new FormGroup({});

  /** The settings definitions. */
  settingDefinitions: SettingDefinition[] = new Array();

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.settingsService.settings.forEach(setting => {
      let definition = new SettingDefinition();
      definition.setting = setting;
      definition.value = new ScalarPropertyValue(this.settingsService.getSetting(setting.id));
      console.log(`Settings ${definition.setting.id} has value ${definition.value}`);
      this.settingDefinitions.push(definition);
    });
  }

  settingChanged(key: string, value: any) {
    console.log(`Settings ${key} changed to ${value}`);
    this.settingsService.setSetting(key, value);
  }

}

export class SettingDefinition {
  setting: Setting;
  value: any;
}
