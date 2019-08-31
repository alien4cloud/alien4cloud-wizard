import {Injectable} from '@angular/core';
import {UserStatus} from "@app/core/models";
import {GenericService} from "@app/core/services/generic.service";
import {LoginService} from "@app/core/services/login.service";
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {Observable, ReplaySubject} from "rxjs";

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
    private loginService: LoginService
  ) {
    super(http, translate);
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
    let url = GenericService.BASE_URL + "/auth/status";
    return this.handleResult<UserStatus>(this.http.get(url));
  }

}
