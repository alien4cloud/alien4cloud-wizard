import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private features: Feature[] = [];

  constructor(
  ) { }

  ngOnInit() {
    // this list will probably partially come from backend
    let dashboard = new Feature(
      "Applications dashboard",
      "List all applications, view deployment status, view meta-data, view applications' modules ...",
      "dashboard",
      "/application-dashboard",
      true
    );
    let wizard = new Feature(
      "Application Wizard",
      "Create a new application from a template, step by step",
      "create_new_folder",
      "/new-wizard",
      true
    );
    let modules = new Feature(
      "Catalog",
      "Browse platform components catalog and display details about components",
      "view_module",
      "/catalog",
      false
    );

    // FIXME: just to figure out what it will look like with more feature
    for (var _i = 0; _i < 3; _i++) {
      this.features.push(dashboard);
      this.features.push(wizard);
      this.features.push(modules);
    }

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
