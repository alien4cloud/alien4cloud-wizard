import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { retry, catchError,tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import * as moment from "moment";

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private router: Router
  ) {
    // a service can not implement OnInit, let's call it in construcor
    this.ngOnInit();
  }

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  private currentRoute: string;

  /**
   * Check if JWT token is found in storage and that it'snt expired.
   */
  ngOnInit() {
    const jwt_token = this.localStorage.retrieve('jwt_token');
    const jwt_expireAt = this.localStorage.retrieve('jwt_expireAt');
    if (!!jwt_token && !!jwt_expireAt) {
      const expiresAt = JSON.parse(jwt_expireAt);
      // the token is valid if expiratino date is not past
      const isValidToken = moment().isBefore(moment(expiresAt));
      this.isAuthenticatedSubject.next(isValidToken);
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  /**
   * Removes JWT stufs from storage.
   */
  private clearToken() {
    this.localStorage.clear('jwt_token');
    // this.localStorage.store('jwt_token', 'void');
    this.localStorage.clear('jwt_expireAt');
    this.isAuthenticatedSubject.next(false);
  }

  login(credentials, callback?) {
    this.clearToken();

    const cb = callback || function() {};

    // FIXME: this is not url encoded
    var body = "user=" + credentials.username + "&password=" + credentials.password;

    return this.http.post('/api/rest/jwtauth', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      // observe: 'response' // uncomment of you what the whole response http : data will be accessed by data.body
    }).subscribe(
      data => {
        console.log("POST Request is successful ", data);
        // 'token' is the JWT token
        this.localStorage.store('jwt_token', data['data']['token']);
        // 'expireAt' is the expiratino date as long
        this.localStorage.store('jwt_expireAt', data['data']['expireAt']);
        this.isAuthenticatedSubject.next(true);
        if (!!this.currentRoute) {
          this.router.navigate([this.currentRoute]);
        } else {
          this.router.navigate([""]);          
        }
      },
      error => {
        console.log("Error", error);
        this.isAuthenticatedSubject.next(false);
      }
    );
  }

  logout(currentRoute?: string) {
    this.currentRoute = currentRoute;
    this.clearToken();
    // and redirect to login route
    this.router.navigate(["login"]);
  }

}
