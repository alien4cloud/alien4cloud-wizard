import {Injectable} from '@angular/core';
import {LocalStorageService} from "ngx-webstorage";
import {PropertyDefinition, PropertyValue, ScalarPropertyValue} from "@app/core/models";
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public static SHOW_FSM_GRAPH_SETTING: string = "settings:show-fsm-graph";
  public static FSM_GRAPH_HEIGHT_SETTING: string = "settings:fsm-graph-height";
  public static FSM_GRAPH_ZOOM_LEVEL: string = "settings:fsm-graph-zoom-level";
  public static WIZARD_SHOWS_WELCOME: string = "settings:wizard-shows-welcome";

  settings: Map<string, Setting> = new Map<string, Setting>();

  constructor(private localStorage: LocalStorageService) {
    let showFsmGrzph = new Setting();
    showFsmGrzph.id = SettingsService.SHOW_FSM_GRAPH_SETTING;
    showFsmGrzph.label = "Show FSM graph";
    showFsmGrzph.type = 'boolean';
    showFsmGrzph.default = new ScalarPropertyValue('false');
    showFsmGrzph.description = "Choose if you want to display a graph representing the FSM (for developpers).";
    this.settings.set(showFsmGrzph.id, showFsmGrzph);

    let fsmGraphHeight = new Setting();
    fsmGraphHeight.id = SettingsService.FSM_GRAPH_HEIGHT_SETTING;
    fsmGraphHeight.label = "FSM Graph height";
    fsmGraphHeight.type = 'integer';
    fsmGraphHeight.default = new ScalarPropertyValue('200');
    fsmGraphHeight.description = "Height of the panel to display FSM graph.";
    fsmGraphHeight.options = {useSlider : true, sliderMin: 100, sliderMax: 1800, sliderStep: 10};
    this.settings.set(fsmGraphHeight.id, fsmGraphHeight);

    let fsmGraphZoomLevel = new Setting();
    fsmGraphZoomLevel.id = SettingsService.FSM_GRAPH_ZOOM_LEVEL;
    fsmGraphZoomLevel.label = "FSM Graph Zoom Level";
    fsmGraphZoomLevel.type = 'float';
    fsmGraphZoomLevel.default = new ScalarPropertyValue('1');
    fsmGraphZoomLevel.description = "Zoom level for the FSM graph.";
    fsmGraphZoomLevel.options = {useSlider : true, sliderMin: 0.1, sliderMax: 4.0, sliderStep: 0.1};
    this.settings.set(fsmGraphZoomLevel.id, fsmGraphZoomLevel);

    let displayWizardWelcome = new Setting();
    displayWizardWelcome.id = SettingsService.WIZARD_SHOWS_WELCOME;
    displayWizardWelcome.label = "Display Welcome page in Wizard";
    displayWizardWelcome.type = 'boolean';
    displayWizardWelcome.default = new ScalarPropertyValue('true');
    displayWizardWelcome.description = "Disable this option if you want to skip the welcome page in the wizard.";
    this.settings.set(displayWizardWelcome.id, displayWizardWelcome);
  }

  setSetting(key: string, value: any) {
    this.localStorage.store(key, value);
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
}
