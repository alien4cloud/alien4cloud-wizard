import {Injectable} from '@angular/core';
import {LocalStorageService} from "ngx-webstorage";
import {PropertyDefinition, PropertyValue, ScalarPropertyValue} from "@app/core/models";
import * as _ from "lodash";
import {ReplaySubject} from "rxjs";
import {DeploymentStatusChangeEvent} from "@app/core/models/internal-event.model";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public static THEME_NAME: string = "settings:theme-name";
  public static SHOW_FSM_GRAPH_SETTING: string = "settings:show-fsm-graph";
  public static FSM_GRAPH_HEIGHT_SETTING: string = "settings:fsm-graph-height";
  public static FSM_GRAPH_WIDTH_SETTING: string = "settings:fsm-graph-width";
  public static FSM_GRAPH_ZOOM_LEVEL: string = "settings:fsm-graph-zoom-level";
  public static WIZARD_SHOWS_WELCOME: string = "settings:wizard-shows-welcome";

  settings: Map<string, Setting> = new Map<string, Setting>();

  private settingChangeSubject = new ReplaySubject<Setting>(1);
  settingChange = this.settingChangeSubject.asObservable();

  constructor(private localStorage: LocalStorageService) {
    let themeName = new Setting();
    themeName.id = SettingsService.THEME_NAME;
    themeName.label = "Look'n feel theme";
    themeName.type = 'string';
    themeName.default = new ScalarPropertyValue('indigo-pink');
    themeName.description = "Choose the theme you want to apply.";
    themeName.constraints = [{validValues: ['deeppurple-amber', 'indigo-pink', 'pink-bluegrey', 'purple-green']}];
    themeName.enabled = true;
    this.settings.set(themeName.id, themeName);

    let showFsmGrzph = new Setting();
    showFsmGrzph.id = SettingsService.SHOW_FSM_GRAPH_SETTING;
    showFsmGrzph.label = "Show FSM graph";
    showFsmGrzph.type = 'boolean';
    showFsmGrzph.default = new ScalarPropertyValue('false');
    showFsmGrzph.description = "Choose if you want to display a graph representing the FSM (for developpers).";
    showFsmGrzph.enabled = !environment.production;
    this.settings.set(showFsmGrzph.id, showFsmGrzph);

    let fsmGraphHeight = new Setting();
    fsmGraphHeight.id = SettingsService.FSM_GRAPH_HEIGHT_SETTING;
    fsmGraphHeight.label = "FSM Graph height";
    fsmGraphHeight.type = 'integer';
    fsmGraphHeight.default = new ScalarPropertyValue('200');
    fsmGraphHeight.description = "Height of the panel to display FSM graph (px).";
    fsmGraphHeight.options = {useSlider : true, sliderMin: 100, sliderMax: 1800, sliderStep: 10};
    fsmGraphHeight.enabled = !environment.production;
    this.settings.set(fsmGraphHeight.id, fsmGraphHeight);

    let fsmGraphWidth = new Setting();
    fsmGraphWidth.id = SettingsService.FSM_GRAPH_WIDTH_SETTING;
    fsmGraphWidth.label = "FSM Graph width";
    fsmGraphWidth.type = 'integer';
    fsmGraphWidth.default = new ScalarPropertyValue('1000');
    fsmGraphWidth.description = "Width of the panel to display FSM graph (px).";
    fsmGraphWidth.options = {useSlider : true, sliderMin: 100, sliderMax: 3840, sliderStep: 10};
    fsmGraphWidth.enabled = !environment.production;
    this.settings.set(fsmGraphWidth.id, fsmGraphWidth);

    let fsmGraphZoomLevel = new Setting();
    fsmGraphZoomLevel.id = SettingsService.FSM_GRAPH_ZOOM_LEVEL;
    fsmGraphZoomLevel.label = "FSM Graph Zoom Level";
    fsmGraphZoomLevel.type = 'float';
    fsmGraphZoomLevel.default = new ScalarPropertyValue('1');
    fsmGraphZoomLevel.description = "Zoom level for the FSM graph.";
    fsmGraphZoomLevel.options = {useSlider : true, sliderMin: 0.1, sliderMax: 4.0, sliderStep: 0.1};
    fsmGraphZoomLevel.enabled = !environment.production;
    this.settings.set(fsmGraphZoomLevel.id, fsmGraphZoomLevel);

    let displayWizardWelcome = new Setting();
    displayWizardWelcome.id = SettingsService.WIZARD_SHOWS_WELCOME;
    displayWizardWelcome.label = "Display Welcome page in Wizard";
    displayWizardWelcome.type = 'boolean';
    displayWizardWelcome.default = new ScalarPropertyValue('true');
    displayWizardWelcome.description = "Disable this option if you want to skip the welcome page in the wizard.";
    displayWizardWelcome.enabled = true;
    this.settings.set(displayWizardWelcome.id, displayWizardWelcome);
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
  label: string;
  value: string;
  enabled: boolean;
}
