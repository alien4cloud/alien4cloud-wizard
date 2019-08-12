import {Injectable} from '@angular/core';
import {GenericResourceService} from "@app/core/services/generic-resource.service";
import {
  ConstraintError,
  ConstraintInformation,
  DeploymentTopologyDTO
} from "@app/core/models";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DeploymentTopologyService extends GenericResourceService<DeploymentTopologyDTO> {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/applications/@{applicationId}/environments/@{environmentId}/deployment-topology");
  }

  getDeploymentTopology(applicationId: string, environmentId: string): Observable<DeploymentTopologyDTO> {
    console.log(`getDeploymentTopology: applicationId:${applicationId}, environmentId:${environmentId}`);
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    const url = this.getUrl("", urlParams);
    return this.handleResult<DeploymentTopologyDTO>(this.http.get(url));
  }

  setLocationPolicies(applicationId: string, environmentId: string, orchestratorId: string, locationId: string): Observable<{}> {
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    let url = this.getUrl("/location-policies", urlParams);
    let payload = {"orchestratorId": orchestratorId, "groupsToLocations": {"_A4C_ALL": locationId}}
    const obs: Observable<{}> = this.handleResult<{}>(this.http.post(url, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
    return obs;
    // FIXME: here we simulate on long running backend operation
    // return timer(10000).pipe(concatMap(value => {
    //   console.log("Time expired");
    //   return obs;
    // }));
  }

  public updateDeploymentSetup(applicationId: string, environmentId: string, updateRequest: UpdateDeploymentTopologyRequest): Observable<DeploymentTopologyDTO> {
    let urlParams = {applicationId: applicationId, environmentId: environmentId};
    let url = this.getUrl("", urlParams);
    return this.http.put(url, updateRequest).pipe(map(data => {
      if (data['error']) {
        let ci = <ConstraintInformation>data['data'];
        // FIXME : translate error : this.translate.instant("ERRORS." + data['error']['code'], ci)
        throw new ConstraintError(data['error']['code'], data['error']['message'], ci);
      } else {
        return <DeploymentTopologyDTO>data['data'];
      }
    }));
  }

}

/**
 * Used to PUT deployment input updates.
 */
export class UpdateDeploymentTopologyRequest {
  providerDeploymentProperties: Map<string, string>;
  inputProperties: {};
}

