import {Injectable} from '@angular/core';
import {LocalStorageService} from "ngx-webstorage";
import {PropertyDefinition, PropertyValue, ScalarPropertyValue} from "@app/core/models";
import * as _ from "lodash";
import {ReplaySubject} from "rxjs";
import {DeploymentStatusChangeEvent} from "@app/core/models/internal-event.model";
import { environment } from '../../../environments/environment';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public static LANGUAGE: string = "Setting.language";
  public static THEME_NAME: string = "Setting.themeName";
  public static SHOW_FSM_GRAPH_SETTING: string = "Setting.showFsmGrzph";
  public static FSM_GRAPH_HEIGHT_SETTING: string = "Setting.fsmGraphHeight";
  public static FSM_GRAPH_WIDTH_SETTING: string = "Setting.fsmGraphWidth";
  public static FSM_GRAPH_ZOOM_LEVEL: string = "Setting.fsmGraphZoomLevel";
  public static WIZARD_SHOWS_WELCOME: string = "Setting.displayWizardWelcome";
  public static APPLICATION_NAME_PREFIX: string = "Setting.appplicationNamePrefix";
  public static REDIRECT_IN_NEW_TAB: string = "Setting.redirectInNewTab";

  settings: Map<string, Setting> = new Map<string, Setting>();

  private settingChangeSubject = new ReplaySubject<Setting>(1);
  settingChange = this.settingChangeSubject.asObservable();

  constructor(
    private localStorage: LocalStorageService
  ) {
    let themeName = new Setting();
    themeName.id = SettingsService.THEME_NAME;
    themeName.type = 'string';
    themeName.default = new ScalarPropertyValue('indigo-pink');
    themeName.constraints = [{validValues: ['deeppurple-amber', 'indigo-pink', 'pink-bluegrey', 'purple-green']}];
    themeName.enabled = true;
    this.settings.set(themeName.id, themeName);

    let language = new Setting();
    language.id = SettingsService.LANGUAGE;
    language.type = 'string';
    language.default = new ScalarPropertyValue('fr');
    language.constraints = [{validValues: ['fr', 'en']}];
    language.enabled = true;
    this.settings.set(language.id, language);

    let showFsmGrzph = new Setting();
    showFsmGrzph.id = SettingsService.SHOW_FSM_GRAPH_SETTING;
    showFsmGrzph.type = 'boolean';
    showFsmGrzph.default = new ScalarPropertyValue('false');
    showFsmGrzph.enabled = !environment.production;
    this.settings.set(showFsmGrzph.id, showFsmGrzph);

    let fsmGraphHeight = new Setting();
    fsmGraphHeight.id = SettingsService.FSM_GRAPH_HEIGHT_SETTING;
    fsmGraphHeight.type = 'integer';
    fsmGraphHeight.default = new ScalarPropertyValue('200');
    fsmGraphHeight.options = {useSlider : true, sliderMin: 100, sliderMax: 1800, sliderStep: 10};
    fsmGraphHeight.enabled = !environment.production;
    this.settings.set(fsmGraphHeight.id, fsmGraphHeight);

    let fsmGraphWidth = new Setting();
    fsmGraphWidth.id = SettingsService.FSM_GRAPH_WIDTH_SETTING;
    fsmGraphWidth.type = 'integer';
    fsmGraphWidth.default = new ScalarPropertyValue('1000');
    fsmGraphWidth.options = {useSlider : true, sliderMin: 100, sliderMax: 3840, sliderStep: 10};
    fsmGraphWidth.enabled = !environment.production;
    this.settings.set(fsmGraphWidth.id, fsmGraphWidth);

    let fsmGraphZoomLevel = new Setting();
    fsmGraphZoomLevel.id = SettingsService.FSM_GRAPH_ZOOM_LEVEL;
    fsmGraphZoomLevel.type = 'float';
    fsmGraphZoomLevel.default = new ScalarPropertyValue('1');
    fsmGraphZoomLevel.options = {useSlider : true, sliderMin: 0.1, sliderMax: 4.0, sliderStep: 0.1};
    fsmGraphZoomLevel.enabled = !environment.production;
    this.settings.set(fsmGraphZoomLevel.id, fsmGraphZoomLevel);

    let displayWizardWelcome = new Setting();
    displayWizardWelcome.id = SettingsService.WIZARD_SHOWS_WELCOME;
    displayWizardWelcome.type = 'boolean';
    displayWizardWelcome.default = new ScalarPropertyValue('true');
    displayWizardWelcome.enabled = true;
    this.settings.set(displayWizardWelcome.id, displayWizardWelcome);

    let appplicationNamePrefix = new Setting();
    appplicationNamePrefix.id = SettingsService.APPLICATION_NAME_PREFIX;
    appplicationNamePrefix.type = 'string';
    appplicationNamePrefix.default = new ScalarPropertyValue('App');
    appplicationNamePrefix.enabled = true;
    this.settings.set(appplicationNamePrefix.id, appplicationNamePrefix);

    let redirectInNewTab = new Setting();
    redirectInNewTab.id = SettingsService.REDIRECT_IN_NEW_TAB;
    redirectInNewTab.type = 'boolean';
    redirectInNewTab.default = new ScalarPropertyValue('false');
    redirectInNewTab.enabled = true;
    this.settings.set(redirectInNewTab.id, redirectInNewTab);
  }

  setSetting(key: string, value: any) {
    let setting = this.settings.get(key);
    if (setting) {
      setting.value = value;
      this.localStorage.store(key, value);
      console.log("Sending setting change event : ", JSON.stringify(setting));
      this.settingChangeSubject.next(setting);
    }
  }

  getSetting(key: string) {
    let value = this.localStorage.retrieve(key);
    if (value == undefined) {
      value = this.settings.get(key).default.value;
      console.log(`No value found for setting ${key}, returning default value which is ${JSON.stringify(value)}`);
      return value;
    } else {
      console.log(`Value for setting ${key} is ${JSON.stringify(value)}`);
      return value;
    }
  }

}

export class Setting extends PropertyDefinition {
  id: string;
  value: string;
  enabled: boolean;
}
