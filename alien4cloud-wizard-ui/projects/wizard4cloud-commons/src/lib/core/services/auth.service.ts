import {Inject, Injectable} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {Observable, ReplaySubject} from "rxjs";
import {GenericService} from "./generic.service";
import {LoginService} from "./login.service";
import {Feature, UserStatus} from "../models/user.model";
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "../models/commons.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends GenericService {

  userStatus: UserStatus;

  private userStatusSubject = new ReplaySubject<UserStatus>(1);
  public $userStatus = this.userStatusSubject.asObservable();

  constructor(
    http: HttpClient,
    translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings,
    private loginService: LoginService
  ) {
    super(http, translate, bootstrapSettings);
    // at init, we refresh the userStatus (if we are authenticated through A4C it's ok)
    this.refreshUserStatus();
    // subscribe to LoginService events
    this.loginService.isAuthenticated.subscribe(
      (authenticated) => {
        if (!authenticated) {
          this.userStatus = undefined;
          this.userStatusSubject.next(undefined);
        } else {
          this.refreshUserStatus();
        }
      }
    );
  }

  private refreshUserStatus() {
    this.getLoginStatus().subscribe(userStatus => {
      this.userStatus = userStatus;
      this.userStatusSubject.next(this.userStatus);
    });
    // TODO: catch error
  }

  getLoginStatus(): Observable<UserStatus> {
    const url = this.baseUrl + "/auth/status";
    return this.handleResult<UserStatus>(this.http.get(url));
  }

  getAddonFeatures(): Observable<Feature[]> {
    const url = this.baseUrl + "/wizard/addons";
    return this.handleResult<Feature[]>(this.http.get(url));
  }

}
