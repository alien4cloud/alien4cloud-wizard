import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {SettingsService, Setting, ScalarPropertyValue} from "@app/core";
import * as _ from "lodash";

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

    this.settingsService.settingChange.subscribe(s => {
      console.log("Setting change detection : ", JSON.stringify(s))
      let idx = _.findIndex(this.settingDefinitions, setting => setting.setting.id == s.id);
      if (idx > -1) {
        // this.settingDefinitions[idx].value = s.value;
        if (this.settingsForm.get(s.id) && this.settingsForm.get(s.id).value != s.value) {
          this.settingsForm.get(s.id).setValue(s.value);
        }
      } else {
        console.log("No setting found corresponding to change")
      }
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
