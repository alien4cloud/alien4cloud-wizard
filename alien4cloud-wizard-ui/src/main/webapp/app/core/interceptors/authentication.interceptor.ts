import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {LocalStorageService} from 'ngx-webstorage';
import {HttpInterceptor, HttpRequest, HttpErrorResponse, HttpHandler, HttpEvent} from '@angular/common/http';
import {LoginService} from '../services/login.service';
import {environment} from '../../../environments/environment';

/**
 * Intercept all http calls (except jwtauth endpoint) and add auth token to Authorization header.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private localStorage: LocalStorageService,
    private loginService: LoginService,
    private router: Router
  ) {}

  // indicates if a failure has already been detected, to rember the right current route.
  failureDetected: boolean;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log("Environment is production ? : ", environment.production);
    if (environment.production) {
      // No interceptor att all in production
      return next.handle(request);
    }

    // for jwauth endpoint we don't want to intercept
    if (!request || !request.url || request.url.indexOf(environment.urlPrefix + "/rest/jwtauth") > -1) {
      return next.handle(request);
    }

    // add the JWT token to header
    const token = this.localStorage.retrieve('jwt_token');
    if (!!token) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
    }

    // handle the request and intercept auth error
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          this.failureDetected = false;
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse && !this.failureDetected) {
            if (err.status === 403 || err.status === 401) {
              this.failureDetected = true;
              console.log("Current route is : " + this.router.url);
              this.loginService.logout(this.router.url);
            }
          }
        }
      )
    );
  }
}
