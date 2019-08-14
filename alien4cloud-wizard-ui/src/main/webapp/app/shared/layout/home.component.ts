import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HealthService} from "@app/core";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public features: Feature[] = [];

  // indicates if the A4C webapp is reachable
  private isConnected: boolean;

  constructor(
    healthService: HealthService
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
    let modules = new Feature(
      "Catalog",
      "Browse platform components catalog and display details about components.",
      "view_module",
      "/catalog",
      false
    );

    this.features.push(dashboard);
    this.features.push(wizard);
    this.features.push(modules);

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
