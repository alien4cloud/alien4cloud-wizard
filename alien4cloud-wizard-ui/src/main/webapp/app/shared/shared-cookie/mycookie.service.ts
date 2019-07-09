import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class MyCookieService {
private cookie  = 'node01mjxjji0b1knlzgvmc0a8czta1.node0' ;

  constructor() {} ;

  getCookie(): string {
    return  this.cookie ;
  } ;
}
