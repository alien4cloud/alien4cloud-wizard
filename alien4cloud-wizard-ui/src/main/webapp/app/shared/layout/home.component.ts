import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthService, HealthService, User, UserStatus} from "@app/core";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  features: Feature[] = [];

  // indicates if the A4C webapp is reachable
  isConnected: boolean;

  constructor(
    healthService: HealthService,
    private authService: AuthService
  ) {
    healthService.isConnected.subscribe(
      (connected) => {
        this.isConnected = connected;
      }
    )
  }

  ngOnInit() {
    // this list will probably partially come from backend
    let dashboard = new Feature(
      "Dashboard",
      "List all applications, view deployment status, view meta-data, view applications' modules ...",
      "dashboard",
      "/application-dashboard",
      true
    );
    let wizard = new Feature(
      "Application Wizard",
      "Create a new application from a template, step by step.",
      "create_new_folder",
      "/new-wizard",
      true
    );
    let catalog = new Feature(
      "Catalog",
      "Browse platform components catalog and display details about components.",
      "view_module",
      "/catalog",
      true
    );
    let settings = new Feature(
      "Settings",
      "Setup few options about this application (look'n feel, features ...).",
      "settings",
      "/settings",
      true
    );

    this.features.push(dashboard);
    this.features.push(wizard);
    this.features.push(catalog);
    this.features.push(settings);

    this.authService.$userStatus.subscribe(userStatus => {
      if (userStatus) {
        dashboard.allowed = true;
        wizard.allowed = User.canCreateApp(userStatus.roles);
        settings.allowed = true;
        catalog.allowed = User.canBrowseModules(userStatus.roles);
      } else {
        this.features.forEach(feature => feature.allowed = false);
        settings.allowed = true;
      }
    })

  }

}

export class Feature {
  public active: boolean;
  constructor(
    public name: string,
    public description: string,
    public iconName: string,
    public activationLink: string,
    public allowed: boolean
  ) { }
}
