import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyCookieService {
private cookie  = 'node0a16gjx7yegz4sbzbrb823ovq1.node0' ;

  constructor() {} ;

  getCookie(): string {
    return  this.cookie ;
  } ;
}
