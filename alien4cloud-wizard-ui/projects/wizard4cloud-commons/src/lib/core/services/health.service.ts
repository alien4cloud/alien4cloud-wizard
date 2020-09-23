import {Inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, interval } from 'rxjs';
import {GenericService} from "./generic.service";
import {TranslateService} from "@ngx-translate/core";
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "../models/commons.model";

/**
 * This service will regularly check if the A4C backend is available.
 */
@Injectable({ providedIn: 'root' })
export class HealthService extends GenericService {
  constructor(
    http: HttpClient,
    translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings
  ) {
    super(http, translate, bootstrapSettings);
    // a service can not implement OnInit, let's call it in constructor
    this.ngOnInit();
  }

  private isConnectedSubject = new ReplaySubject<boolean>(1);
  public isConnected = this.isConnectedSubject.asObservable();

  ngOnInit() {
    this.healthCheck();
    // each minute call the health check A4C endpoint
    interval(1 * 60 * 1000).subscribe(x => {
      this.healthCheck();
    });
  }

  private healthCheck() {
    // TODO: manage environment
    return this.http.get(this.getUrlPrefix() + '../rest/admin/health').subscribe(
      data => {
        // console.log("A4C is connected ", data);
        this.isConnectedSubject.next(true);
      },
      error => {
        console.warn("A4C is not connected ", error);
        this.isConnectedSubject.next(false);
      }
    );
  }

}
