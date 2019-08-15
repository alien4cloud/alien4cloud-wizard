import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {LocalStorageService} from "ngx-webstorage";
import {SettingsKey} from "@app/core/etc/settings-key.enum";

@Component({
  selector: 'w4c-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  /** The form. */
  settingsForm = new FormGroup({});

  showFsmGraphCtrl = new FormControl();
  fsmGraphHeightCtrl = new FormControl();

  constructor(private localStorage: LocalStorageService) { }

  ngOnInit() {
    // TODO use a SettingService
    let value = this.localStorage.retrieve(SettingsKey.SHOW_FSM_GRAPH_SETTING);
    if (value) {
      this.showFsmGraphCtrl.setValue(value);
    } else {
      this.showFsmGraphCtrl.setValue(false)
    }
    value = this.localStorage.retrieve(SettingsKey.FSM_GRAPH_HEIGHT_SETTING);
    if (value) {
      this.fsmGraphHeightCtrl.setValue(value)
    }else {
      this.fsmGraphHeightCtrl.setValue(200)
    }

    this.showFsmGraphCtrl.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      console.log("showFsmGraphCtrl value changes : ", JSON.stringify(value));
      this.localStorage.store(SettingsKey.SHOW_FSM_GRAPH_SETTING, value);
    });
    this.fsmGraphHeightCtrl.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      console.log("fsmGraphHeightCtml value changes : ", JSON.stringify(value));
      this.localStorage.store(SettingsKey.FSM_GRAPH_HEIGHT_SETTING, value);
    });
  }

}
