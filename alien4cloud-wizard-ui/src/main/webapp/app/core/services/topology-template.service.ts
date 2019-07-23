import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Application } from '@app/core';
import { TopologyTemplate } from '../models/topology-template.model';

/*
export interface Topology {
  id: string;
  author : string;
  previousOperationId: string;
  updatedDependencies:UpdatedDependency[] ;
  recoveringOperations:[];
  lastOperationId: string;
  resume: string ;
}

export interface UpdatedDependency  {
  name : string;
  version: string;
  hash: string;
}

*/

export class AppCreationTopoPayload {
  name: string;
  archiveName: string;
  topologyTemplateVersionId: string;
  description : string ;
}

@Injectable({
  providedIn: 'root'
})
export class TopologyTemplateService {

  apiURL = '/api';
  public searchTopoUrl: string = '/rest/latest/catalog/topologies/search';
  public createAppByTopoUrl: string  = '/rest/latest/applications';

  //public searchUrl = '/rest/latest/applications/search';


  projects: Application[];

  constructor(private http: HttpClient) { }


  getTopologyOverview(id: string): Observable<{}> {
    return this.http.get(`/api/rest/latest/wizard/topologies/overview/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).pipe(
      data => data );
  }

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


  getTopologyById(id: string): Observable<{}> {
    let getTopoUrl = `/rest/latest/topologies/${id}`;
    return this.http.get(this.apiURL + getTopoUrl)
      //if api returns any data
      .pipe(data => data);
  }

  createApplication(payload: AppCreationTopoPayload): Observable<{}> {

    //let data = { "name": payload.name, "archiveName": payload.archiveName, "topologyTemplateVersionId": payload.topologyTemplateVersionId };
    console.log("topologyTemplateVersionId  :", payload.topologyTemplateVersionId)
    return this.http.post(this.apiURL + this.createAppByTopoUrl, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    });
  }

  createAppByTopology(payload: AppCreationTopoPayload): Observable<{}> {

    //let data = { "name": payload.name, "archiveName": payload.archiveName, "topologyTemplateVersionId": payload.topologyTemplateVersionId };
    console.log("topologyTemplateVersionId  :", payload.topologyTemplateVersionId)
    return this.http.post(this.apiURL + this.createAppByTopoUrl, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).pipe(
      data => data);
  }

  async  createAppByTopologyAsync(payload: AppCreationTopoPayload) {

    //let data = { "name": payload.name, "archiveName": payload.archiveName, "topologyTemplateVersionId": payload.topologyTemplateVersionId };
    console.log("topologyTemplateVersionId  :", payload.topologyTemplateVersionId)
    return await this.http.post(this.apiURL + this.createAppByTopoUrl, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).toPromise();

  }
  

}
