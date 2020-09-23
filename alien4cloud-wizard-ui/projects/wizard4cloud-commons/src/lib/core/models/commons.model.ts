import {InjectionToken} from "@angular/core";

export const BOOTSTRAP_SETTINGS = new InjectionToken<string>('Application Configuration');

export interface BootstrapSettings {
  production: boolean;
  urlPrefix: string;
}
