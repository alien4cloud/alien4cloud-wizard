import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Application } from '@app/core';

@Injectable({
  providedIn: 'root'
})
export class TopologyTemplateService {

  apiURL = '/api';
  public searchTopoUrl = '/rest/latest/catalog/topologies/search';
  //public searchUrl = '/rest/latest/applications/search';


  projects: Application[];

  constructor(private http: HttpClient) { }



  getTopologies(from?: number, size?: number, query?: string): Observable<{}> {
    if (!from) {
      from = 0;
    }
    if (!size) {
      size = 20;
    }
    if (!query) {
      query = "";
    }
    let data = { "from": from, "size": size, "query": query };
    return this.http.post(this.apiURL + this.searchTopoUrl, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).pipe(
      data => data);

  }

}
