import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import {SettingsService} from "@app/core";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor (
    private translateService: TranslateService,
    private settingsService: SettingsService,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translateService.setDefaultLang("en");
    // get the language setting stored in cookie for A4C legacy (a JSON like "fr-fr" or "en-us" ...)
    let cookieLang = this.cookieService.get("NG_TRANSLATE_LANG_KEY");
    if (cookieLang) {
      let jsonCookieLang = JSON.parse(cookieLang);
      cookieLang = jsonCookieLang.split("-")[0];
      console.log("Language in cookie is : ", cookieLang);
    }
    let settingLang = this.settingsService.getSetting(SettingsService.LANGUAGE);
    console.log("Language in settings is : ", settingLang)
    if (cookieLang && cookieLang != settingLang) {
      console.log("Changing lang in settings to ", cookieLang)
      this.settingsService.setSetting(SettingsService.LANGUAGE, cookieLang);
    }
    this.translateService.use(this.settingsService.getSetting(SettingsService.LANGUAGE));
    // listen for change in settings
    this.settingsService.settingChange.subscribe(setting => {
      if (setting.id == SettingsService.LANGUAGE) {
        this.translateService.use(setting.value);
      }
    });
  }
}
