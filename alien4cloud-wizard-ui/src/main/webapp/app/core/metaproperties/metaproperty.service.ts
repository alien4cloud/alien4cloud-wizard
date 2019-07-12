import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetapropertyService {

  target: string[];
  public metaUrl ='/api/rest/latest/metaproperties/search';

  /*
  constructor(private http: HttpClient, metatarget: string[]) {
    this.target = metatarget ;
   }
   */

   constructor(private http: HttpClient) {}

  getMetaproperties(metatarget: string[]): Observable<{}> {
    const data = {"query":"","filters":{"target":metatarget},"from":0,"size":5000000}
  
    return this.http.post(this.metaUrl, data , {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).pipe(
     data => data );

  }
}
