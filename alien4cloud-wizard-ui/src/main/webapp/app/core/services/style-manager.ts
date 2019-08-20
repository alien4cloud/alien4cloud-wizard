import {Injectable} from '@angular/core';
import {SettingsService} from "@app/core/services/settings.service";


/**
 * Class for managing stylesheets. Stylesheets are loaded into named slots so that they can be
 * removed or changed later.
 */
@Injectable()
export class StyleManager {

  private static DEFAULT_THEME_NAME = "indigo-pink";

  constructor(private settingsService: SettingsService) {
    this.installTheme(this.settingsService.getSetting(SettingsService.THEME_NAME));
    this.settingsService.settingChange.subscribe(setting => {
      if (setting.id == SettingsService.THEME_NAME) {
        console.log("Theme changed : ", setting.value);
        this.installTheme(setting.value);
      }
    });
  }

  /**
   * Set the stylesheet with the specified key.
   */
  setStyle(key: string, href: string) {
    getLinkElementForKey(key).setAttribute('href', href);
  }

  /**
   * Remove the stylesheet with the specified key.
   */
  removeStyle(key: string) {
    const existingLinkElement = getExistingLinkElementByKey(key);
    if (existingLinkElement) {
      document.head.removeChild(existingLinkElement);
    }
  }

  installTheme(themeName: string) {
    if (themeName == StyleManager.DEFAULT_THEME_NAME ) {
      this.removeStyle('theme');
    } else {
      this.setStyle('theme', `assets/styles/built/${themeName}.css`);
    }
  }
}

function getLinkElementForKey(key: string) {
  return getExistingLinkElementByKey(key) || createLinkElementWithKey(key);
}

function getExistingLinkElementByKey(key: string) {
  return document.head.querySelector(`link[rel="stylesheet"].${getClassNameForKey(key)}`);
}

function createLinkElementWithKey(key: string) {
  const linkEl = document.createElement('link');
  linkEl.setAttribute('rel', 'stylesheet');
  linkEl.classList.add(getClassNameForKey(key));
  document.head.appendChild(linkEl);
  return linkEl;
}

function getClassNameForKey(key: string) {
  return `style-manager-${key}`;
}
