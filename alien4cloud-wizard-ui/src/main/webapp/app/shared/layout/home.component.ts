import {Component, OnInit} from '@angular/core';
import {AuthService, HealthService, User} from "@app/core";

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
      "dashboard",
      "dashboard",
      "/application-dashboard",
      true
    );

    let wizard = new Feature(
      "wizard",
      "create_new_folder",
      "/new-wizard",
      true
    );

    let catalog = new Feature(
      "catalog",
      "view_module",
      "/catalog",
      true
    );

    let settings = new Feature(
      "settings",
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
    public id: string,
    public iconName: string,
    public activationLink: string,
    public allowed: boolean
  ) { }
}
