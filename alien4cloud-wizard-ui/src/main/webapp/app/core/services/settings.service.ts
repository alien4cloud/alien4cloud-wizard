import {Injectable} from '@angular/core';
import {LocalStorageService} from "ngx-webstorage";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private localStorage: LocalStorageService) {
  }

  setSetting(key: string, value: any) {
    this.localStorage.store(key, value);
  }

  getSetting(key: string, default_value: any) {
    let value = this.localStorage.retrieve(key);
    return (value !== undefined) ? value : default_value;
  }

}

export enum SettingsKey {
  SHOW_FSM_GRAPH_SETTING = "settings:show-fsm-graph",
  FSM_GRAPH_HEIGHT_SETTING = "settings:fsm-graph-height",
  FSM_GRAPH_ZOOM_LEVEL = "settings:fsm-graph-zoom-level"
}
