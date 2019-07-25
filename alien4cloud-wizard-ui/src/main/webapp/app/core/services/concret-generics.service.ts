import { Injectable } from '@angular/core';
import { GenericsService } from './generics.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConcretGenericsService extends GenericsService {

  constructor(http: HttpClient) { 
    super(http);
  }


  getAppEnvironments(from: number  , pageSize: number, query: string, applicationId: string ) : Observable<{}>{
    let getTopoUrl = `/rest/latest/applications/${applicationId}` + `/environments/search`;
    console.log("url env app :" + getTopoUrl);
    return this.getGenerics(getTopoUrl, from, pageSize, query).pipe(data => data);
  }


}
