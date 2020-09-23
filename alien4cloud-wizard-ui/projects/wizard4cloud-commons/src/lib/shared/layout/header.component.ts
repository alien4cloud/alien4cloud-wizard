import {Component, Inject, OnInit} from '@angular/core';
import {LoginService} from "../../core/services/login.service";
import {HealthService} from "../../core/services/health.service";
import {StyleManager} from "../../core/services/style-manager";
import {AuthService} from "../../core/services/auth.service";
import {
  REDIRECTION_PROVIDER,
  RedirectionProviderService
} from "../../core/services/redirection-provider-service";

@Component({
  selector: 'w4c-layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class LHeaderComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private healthService: HealthService,
    /** Style manager is injected so that it is built. */
    private styleManager: StyleManager,
    public authService: AuthService,
    @Inject(REDIRECTION_PROVIDER) private redirectionProviderService: RedirectionProviderService
  ) {
    this.isProduction = loginService.isProduction();
  }

  // indicates if the user is logged in
  isAuthenticated: boolean;
  // indicates if the A4C webapp is reachable
  isConnected: boolean;

  // TODO: manage env
  //isProduction = environment.production;
  public isProduction = false;

  ngOnInit() {
    this.loginService.isAuthenticated.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;
      }
    );
    this.healthService.isConnected.subscribe(
      (connected) => {
        this.isConnected = connected;
      }
    );
  }

  getStatusIcon() {
    if (this.isConnected) {
      if (this.isAuthenticated) {
        return "signal_wifi_4_bar";
      } else {
        return "signal_wifi_4_bar_lock";
      }
    } else {
      return "signal_wifi_off";
    }
  }

  getStatusText() {
    if (this.isConnected) {
      if (this.isAuthenticated) {
        return "Connected to backend and authenticated";
      } else {
        return "Connected to backend but not authenticated";
      }
    } else {
      return "Not connected to backend !";
    }
  }

  logout() {
    this.loginService.logout();
  }

  a4cRedirect() {
    window.location.assign("../");
  }

  wizardRedirect() {
    this.redirectionProviderService.homeRedirect();
  }

  settingsRedirect() {
    this.redirectionProviderService.settingsRedirect();
  }

}
