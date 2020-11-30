import {Component, OnInit} from '@angular/core';
import {Feature, User, HealthService, AuthService} from "@alien4cloud/wizard4cloud-commons";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  features: Feature[] = [];
  addons: Feature[] = [];

  // indicates if the A4C webapp is reachable
  isConnected: boolean;

  constructor(
    healthService: HealthService,
    private authService: AuthService,
    private router: Router
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
      true,
      false
    );

    let wizard = new Feature(
      "wizard",
      "create_new_folder",
      "/new-wizard",
      true,
      false
    );

    let catalog = new Feature(
      "catalog",
      "view_module",
      "/catalog",
      true,
      false
    );

    let settings = new Feature(
      "settings",
      "settings",
      "/settings",
      true,
      false
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
        this.features.forEach(feature => feature.enabled = true);
        this.addons.forEach(feature => feature.enabled = true);
      } else {
        this.features.forEach(feature => feature.enabled = false);
        this.addons.forEach(feature => feature.enabled = false);
      }
    });

    this.authService.getAddonFeatures().subscribe(features => {
      features.forEach(feature => this.addons.push(feature));
    });

  }

  isFeatureAvailable(feature: Feature) {
    return feature.allowed && feature.enabled && this.isConnected;
  }

  openFeature(feature: Feature) {
    if (this.isFeatureAvailable(feature)) {
      this.router.navigate([feature.activationLink]);
    }
  }

  openAddon(feature: Feature) {
    if (this.isFeatureAvailable(feature)) {
      window.location.assign("../" + feature.activationLink);
    }
  }

}


