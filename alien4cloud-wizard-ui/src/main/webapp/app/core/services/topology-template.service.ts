import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Application } from '@app/core';
import { TopologyTemplate } from '../models/topology-template.model';
import { DeploymentPropertyCheck } from '../models';

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
  public deployAppUrl: string  = '/rest/latest/applications/deployment';

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


  getEnvDeploymentTopology(appArchive: string , envId:String): Observable<{}> {
    let getDeplUrl = `/rest/latest/applications/${appArchive}/environments/${envId}/deployment-topology`;
    return this.http.get(this.apiURL + getDeplUrl)
      //if api returns any data
      .pipe(data => data);
  }

  
  putEnvDeploymentTopology(appArchive: string , envId:String,providerDeploymentProperties: {}): Observable<{}> {
    let getDeplUrl = `/rest/latest/applications/${appArchive}/environments/${envId}/deployment-topology`;
    return this.http.post(this.apiURL + getDeplUrl, providerDeploymentProperties, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).pipe(
      data => data);
  }
  
  postLocationPolicies( appArchive: String , envId: String , orchestratorId : string, groupLocation : string): Observable<{}> {
    let getDeplUrl = `/rest/latest/applications/${appArchive}/environments/${envId}/deployment-topology/location-policies`;
    let payload = {"orchestratorId": orchestratorId,"groupsToLocations":{"_A4C_ALL":groupLocation}}
    return this.http.post(this.apiURL + getDeplUrl, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).pipe(
      data => data);
  }

  
  getDeploymentPropertyDefinitions(orchId:String): Observable<{}> {
    let getDeplPropUrl = `/rest/latest/orchestrators/${orchId}/deployment-property-definitions`;
    return this.http.get(this.apiURL + getDeplPropUrl)
      //if api returns any data
      .pipe(data => data);
  }
  

  getEnvLocations(topoArchive: string , envId:String): Observable<{}> {
    let getEnvLocUrl = `/rest/latest/topologies/${topoArchive}/locations?environmentId=${envId}`;
    return this.http.get(this.apiURL + getEnvLocUrl)
      //if api returns any data
      .pipe(data => data);
  }

  deploymentPropCheck( payloadProp: DeploymentPropertyCheck ,orchestratorId : string): Observable<{}> {
    let postDeplPropUrl = `/rest/latest/orchestrators/${orchestratorId}/deployment-prop-check`;   
    return this.http.post(this.apiURL + postDeplPropUrl, payloadProp, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).pipe(
      data => data);
  }




  deployApplication( applicationId: String , applicationEnvironmentId: String ): Observable<{}> {
    let payload = {"applicationId":applicationId, "applicationEnvironmentId":applicationEnvironmentId};   
    return this.http.post(this.apiURL + this.deployAppUrl, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).pipe(
      data => data);
  }
}
