import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError,tap } from 'rxjs/operators';
import { Status,Application } from '@app/core';


@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  apiURL = '/api';
  public searchEnvUrl = '/rest/latest/applications/environments';
  public searchUrl = '/rest/latest/applications/search';
 

  projects: Application[];

  constructor(private http: HttpClient) { }

    // Http Options
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
        // 'Access-Control-Allow-Origin': '*'
        'A4C-Agent': 'AngularJS_UI'
      }),
      observe: 'response'
    }
  
    // HttpClient API get() method => Fetch employees list
    
    getStatus(): Observable<Status> {
      return this.http.get<Status>(this.apiURL + '/rest/admin/health')
        .pipe(
          retry(1),
          catchError(this.handleError)
        )
    }
  
    getAppsEnv(): {} {
      //const data = { "from": 0,"size": 20} ;
  
  
      //let options = new RequestOptions({ headers: headers, withCredentials: true });
  
      console.log('---------------------> THE SEARCH URL :' + this.apiURL + this.searchUrl);
  
      return this.http.post(this.apiURL + this.searchUrl, ["TestApp"], {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=UTF-8',
          // 'Access-Control-Allow-Origin': '*'
          'A4C-Agent': 'AngularJS_UI'
  
        }),
        // observe: 'response' // uncomment of you what the whole response http : data will be accessed by data.body
      }).subscribe(
        data => {
          console.log("POST Request is successful ", data);
        },
        error => {
  
          console.log("Error", error);
  
        }
  
      );
  
  
      //  console.log("AFTER RESPONSE")
    }
  
  
    getApplications(): Observable<{}> {
  
      return this.http.post(this.apiURL + this.searchUrl, {"from":0,"size":20}, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=UTF-8',
        }),
      }).pipe(
       data => data );
  
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


