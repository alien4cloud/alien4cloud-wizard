import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class MyCookieService {
private cookie  = 'node096vs721zbkub1goeu4crkk2i10.node0' ;

  constructor() {} ;

  getCookie(): string {
    return  this.cookie ;
  } ;
}
