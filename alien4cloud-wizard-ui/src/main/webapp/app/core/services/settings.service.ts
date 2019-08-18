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
  }

  setSetting(key: string, value: any) {
    this.localStorage.store(key, value);
  }

  getSetting(key: string) {
    let value = this.localStorage.retrieve(key);
    if (value !== undefined) {
      return value;
    }
    return this.settings.get(key).default;
  }

}

export class Setting extends PropertyDefinition {
  id: string;
  label: string;
}
