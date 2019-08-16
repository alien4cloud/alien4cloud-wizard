import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {SettingsService, SettingsKey} from "@app/core";

@Component({
  selector: 'w4c-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  showFsmGraphCtrl = new FormControl();
  fsmGraphHeightCtrl = new FormControl();
  fsmGraphZoomLevel = new FormControl();

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.showFsmGraphCtrl.setValue(this.settingsService.getSetting(SettingsKey.SHOW_FSM_GRAPH_SETTING, false));
    this.fsmGraphHeightCtrl.setValue(this.settingsService.getSetting(SettingsKey.FSM_GRAPH_HEIGHT_SETTING, 200))
    this.fsmGraphZoomLevel.setValue(this.settingsService.getSetting(SettingsKey.FSM_GRAPH_ZOOM_LEVEL, 1))

    this.showFsmGraphCtrl.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      this.settingsService.setSetting(SettingsKey.SHOW_FSM_GRAPH_SETTING, value);
    });
    this.fsmGraphHeightCtrl.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      this.settingsService.setSetting(SettingsKey.FSM_GRAPH_HEIGHT_SETTING, value);
    });
    this.fsmGraphZoomLevel.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      this.settingsService.setSetting(SettingsKey.FSM_GRAPH_ZOOM_LEVEL, value);
    });
  }

}
