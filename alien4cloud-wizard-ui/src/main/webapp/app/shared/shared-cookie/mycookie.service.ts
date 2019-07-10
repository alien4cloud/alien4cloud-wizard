import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class MyCookieService {
private cookie  = 'node0v2e7upfrndqmutty3klx6g8f2.node0' ;

  constructor() {} ;

  getCookie(): string {
    return  this.cookie ;
  } ;
}
