import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TopologyTemplate } from "@app/core";
import { TranslateService } from "@ngx-translate/core";
import { V2GenericService } from "@app/core/serviceV2/generic.service";
import { Observable } from 'rxjs';


export class AppCreationTopoPayload {
  name: string;
  archiveName: string;
  topologyTemplateVersionId: string;
  description: string;
}


@Injectable({
  providedIn: 'root'
})
export class V2TopologyTemplateService extends V2GenericService<TopologyTemplate> {

  //public createAppByTopoUrl: string = '/api/rest/latest/applications';
  //public deployAppUrl: string = '/api/rest/latest/applications/deployment';

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/catalog/topologies")
  }

  getEnvLocations(topoArchive: string, envId: String): Observable<{}> {
    let getEnvLocUrl = `/api/rest/latest/topologies/${topoArchive}/locations?environmentId=${envId}`;
    return this.handleResult<{}>(this.http.get(getEnvLocUrl));
    /*
    return this.http.get(getEnvLocUrl)
      .pipe(data => data);
      */
      
  }

  postLocationPolicies(appArchive: String, envId: String, orchestratorId: string, locationId: string): Observable<{}> {
    let getDeplUrl = `/api/rest/latest/applications/${appArchive}/environments/${envId}/deployment-topology/location-policies`;
    let payload = { "orchestratorId": orchestratorId, "groupsToLocations": { "_A4C_ALL": locationId } }
    return this.handleResult<{}>(this.http.post(getDeplUrl,payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }) 
    }));

    /*
    return this.http.post(getDeplUrl, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).pipe(
      data => data);
      */
  }


  /*
  createAppByTopology(payload: AppCreationTopoPayload): Observable<{}> {

    //let data = { "name": payload.name, "archiveName": payload.archiveName, "topologyTemplateVersionId": payload.topologyTemplateVersionId };
    console.log("topologyTemplateVersionId  :", payload.topologyTemplateVersionId)
    return this.http.post(this.createAppByTopoUrl, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).pipe(
      data => data);
  }
  */


  
  /*
   async  createAppByTopologyAsync(payload: AppCreationTopoPayload) {

    //let data = { "name": payload.name, "archiveName": payload.archiveName, "topologyTemplateVersionId": payload.topologyTemplateVersionId };
    console.log("topologyTemplateVersionId  :", payload.topologyTemplateVersionId)
    return await this.http.post(this.createAppByTopoUrl, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).toPromise();

  }
  */


  /*
  putEnvDeploymentTopology(appArchive: string, envId: String, providerDeploymentProperties: {}): Observable<{}> {
    let getDeplUrl = `/api/rest/latest/applications/${appArchive}/environments/${envId}/deployment-topology`;
    return this.http.post(getDeplUrl, providerDeploymentProperties, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).pipe(
      data => data);
  }

  */

  /*
  getDeploymentPropertyDefinitions(orchId: String): Observable<{}> {
    let getDeplPropUrl = `/api/rest/latest/orchestrators/${orchId}/deployment-property-definitions`;
    return this.http.get(getDeplPropUrl)
      //if api returns any data
      .pipe(data => data);
  }
  */


  /*
  deploymentPropCheck(payloadProp: DeploymentPropertyCheck, orchestratorId: string): Observable<{}> {
    let postDeplPropUrl = `/api/rest/latest/orchestrators/${orchestratorId}/deployment-prop-check`;
    return this.http.post(postDeplPropUrl, payloadProp, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).pipe(
      data => data);
  }
  */

  /*
 getDeploymentPropertyDefinitions(orchId: String): Observable<{}> {
  let getDeplPropUrl = `/api/rest/latest/orchestrators/${orchId}/deployment-property-definitions`;
  return this.http.get(getDeplPropUrl)
    //if api returns any data
    .pipe(data => data);
}
*/


}
