import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class MyCookieService {
private cookie  = 'node01vgth0v7k2mntt2nej6yxbarl1.node0' ;

  constructor() {} ;

  getCookie(): string {
    return  this.cookie ;
  } ;
}
