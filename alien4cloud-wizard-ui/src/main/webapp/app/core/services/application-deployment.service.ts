import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Deployment, InstanceInformation} from '@app/core/models';
import {GenericService} from "@app/core/services/generic.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApplicationDeploymentService extends GenericService {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) { super(http, translate) }

  deploy(applicationId: string, applicationEnvironmentId: string) {
    let payload = {"applicationId": applicationId, "applicationEnvironmentId": applicationEnvironmentId};
    return this.handleResult<{}>(this.http.post(GenericService.BASE_URL+"/applications/deployment", payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
  }

  getActiveDeployment(applicationId: string, environmentId: string): Observable<Deployment> {
    let params = {"applicationId": applicationId, "applicationEnvironmentId": environmentId};
    return this.handleResult<Deployment>(this.http.get(GenericService.BASE_URL+ this.getParametrizedUrl("/applications/@{applicationId}/environments/@{applicationEnvironmentId}/active-deployment", params), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
  }

  undeploy(applicationId: string, environmentId: string): Observable<Deployment> {
    let params = {"applicationId": applicationId, "applicationEnvironmentId": environmentId};
    return this.handleResult<Deployment>(this.http.delete(GenericService.BASE_URL+ this.getParametrizedUrl("/applications/@{applicationId}/environments/@{applicationEnvironmentId}/deployment", params), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
  }

  launchWorkflow(applicationId: string, environmentId: string, workflowName: string): Observable<String> {
    let params = {"applicationId": applicationId, "applicationEnvironmentId": environmentId, "workflowName": workflowName};
    let url = GenericService.BASE_URL+ this.getParametrizedUrl("/applications/@{applicationId}/environments/@{applicationEnvironmentId}/workflows/@{workflowName}", params);
    return this.handleResult<String>(this.http.post(url, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
  }

  getInstanceInformation(applicationId: string, environmentId: string) : Observable<Map<string,InstanceInformation[]>>{
    let params = {"applicationId": applicationId, "applicationEnvironmentId": environmentId};
    let url = GenericService.BASE_URL+ this.getParametrizedUrl("/applications/@{applicationId}/environments/@{applicationEnvironmentId}/deployment/informations", params);
    return this.handleResult<Map<string,[]>>(this.http.get(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
  }
  


}
