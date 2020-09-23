import {InjectionToken} from "@angular/core";

export const REDIRECTION_PROVIDER = 'RedirectionProviderService';

export interface RedirectionProviderService {
  homeRedirect();
  settingsRedirect();
}

export class AddonRedirectionProviderService implements RedirectionProviderService {

  homeRedirect() {
    window.location.assign("../wizard");
  }

  settingsRedirect() {
    window.location.assign("../wizard/#/settings");
  }

}
