import { Component, OnInit } from '@angular/core';
import {LoginService, HealthService, StyleManager, AuthService} from '@app/core';
import {environment} from '../../../environments/environment';

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
    private authService: AuthService
  ) {}

  // indicates if the user is logged in
  isAuthenticated: boolean;
  // indicates if the A4C webapp is reachable
  isConnected: boolean;

  isProduction = environment.production;

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

}
