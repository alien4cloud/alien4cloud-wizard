import { Injectable } from '@angular/core';
import { Application } from '../applications/application.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericsService {

  projects: Application[];
  apiURL = '/api';


  constructor(private http: HttpClient) { }

  getGenerics(url:string, from?: number, size?: number, query?: string): Observable<{}> {
      if (!from) {
        from = 0;
      }
      if (!size) {
        size = 20;
      }
      if (!query) {
        query = "";
      }
      let data = {"from":from,"size":size,"query":query};
      return this.http.post(this.apiURL+url, data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=UTF-8',
        }),
      }).pipe(
       data => data );

    }


    
  getgenericsById(url: string): Observable<{}> {
    //let getTopoUrl = `/rest/latest/topologies/${id}`;
    return this.http.get(this.apiURL + url)
      //if api returns any data
      .pipe(data => data);
  }

    // Error handling
    handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        // Get client-side error
        errorMessage = error.error.message;
      } else {
        // Get server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      window.alert(errorMessage);
      return throwError(errorMessage);
    }
}
