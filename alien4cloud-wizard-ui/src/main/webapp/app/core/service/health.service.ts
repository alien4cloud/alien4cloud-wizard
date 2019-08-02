import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, interval } from 'rxjs';

/**
 * This service will regularly check if the A4C backend is available.
 */
@Injectable({ providedIn: 'root' })
export class HealthService {
  constructor(
    private http: HttpClient
  ) {
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
    return this.http.get('/api/rest/admin/health').subscribe(
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
