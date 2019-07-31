import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationOverview, MultipleDataResult} from "@app/core";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {V2GenericService} from "@app/core/serviceV2/generic.service";
import { DeploymentTopologyDTO } from '../models/deployment-topology-dto.model';


@Injectable({
  providedIn: 'root'
})
export class DeploymentTopologyDtoService extends V2GenericService<DeploymentTopologyDTO> {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/applications/@{applicationId}/environments/@{environmentId}/deployment-topology")
  }

  search(from?: number, size?: number, query?: string, options?: any): Observable<MultipleDataResult<DeploymentTopologyDTO>> {
    throw new Error("Not implemented !");
  }

  /*
  getEnvLocations(applicationId: string, environmentId: String): Observable<MultipleDataResult<DeploymentTopologyDTO>> {
    let urlParams  = {applicationId: applicationId , environmentId: environmentId}
    return this.handleResult<MultipleDataResult<DeploymentTopologyDTO>>(this.http.get(this.getUrl(urlParams)));
    
    //return this.http.get(this.getUrl(urlParams)).pipe(data => data['data']);
      
  } */
  

}
