import {Inject, Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Deployment, InstanceInformation, TopologyDTO} from '@app/core/models';
import {Observable} from "rxjs";
import {AbstractPropertyValue, BOOTSTRAP_SETTINGS, BootstrapSettings} from "@alien4cloud/wizard4cloud-commons";
import {GenericService} from "@alien4cloud/wizard4cloud-commons";

@Injectable({
  providedIn: 'root'
})
export class ApplicationDeploymentService extends GenericService {

  constructor(
    http: HttpClient,
    translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings
  ) { super(http, translate, bootstrapSettings) }

  deploy(applicationId: string, applicationEnvironmentId: string) {
    let payload = {"applicationId": applicationId, "applicationEnvironmentId": applicationEnvironmentId};
    return this.handleResult<{}>(this.http.post(this.baseUrl +"/applications/deployment", payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
  }

  getActiveDeployment(applicationId: string, environmentId: string): Observable<Deployment> {
    let params = {"applicationId": applicationId, "applicationEnvironmentId": environmentId};
    return this.handleResult<Deployment>(this.http.get(this.baseUrl + this.getParametrizedUrl("/applications/@{applicationId}/environments/@{applicationEnvironmentId}/active-deployment", params), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
  }

  getActiveDeploymentTopology(applicationId: string, environmentId: string): Observable<TopologyDTO> {
    let params = {"applicationId": applicationId, "applicationEnvironmentId": environmentId};
    return this.handleResult<TopologyDTO>(this.http.get(this.baseUrl + this.getParametrizedUrl("/applications/@{applicationId}/environments/@{applicationEnvironmentId}/runtime-topology", params), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
  }

  undeploy(applicationId: string, environmentId: string): Observable<Deployment> {
    let params = {"applicationId": applicationId, "applicationEnvironmentId": environmentId};
    return this.handleResult<Deployment>(this.http.delete(this.baseUrl + this.getParametrizedUrl("/applications/@{applicationId}/environments/@{applicationEnvironmentId}/deployment", params), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
  }

  getLastWorkflowInputs(applicationId: string, environmentId: string, workflowName: string): Observable<Map<string, AbstractPropertyValue>> {
    let params = {"applicationId": applicationId, "applicationEnvironmentId": environmentId, "workflowName": workflowName};
    let url = this.baseUrl + this.getParametrizedUrl("/applications/@{applicationId}/environments/@{applicationEnvironmentId}/workflows/@{workflowName}/last_inputs", params);
    return this.handleResult<Map<string, AbstractPropertyValue>>(this.http.get(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
  }

  launchWorkflow(applicationId: string, environmentId: string, workflowName: string, inputs?: any): Observable<string> {
    let params = {"applicationId": applicationId, "applicationEnvironmentId": environmentId, "workflowName": workflowName};
    let url = this.baseUrl + this.getParametrizedUrl("/applications/@{applicationId}/environments/@{applicationEnvironmentId}/workflows/@{workflowName}", params);
    let body = {};
    if (inputs) {
      body = { inputs: inputs };
    }
    return this.handleResult<string>(this.http.post(url, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
  }

  getInstanceInformation(applicationId: string, environmentId: string) : Observable<Map<string,InstanceInformation[]>>{
    let params = {"applicationId": applicationId, "applicationEnvironmentId": environmentId};
    let url = this.baseUrl + this.getParametrizedUrl("/applications/@{applicationId}/environments/@{applicationEnvironmentId}/deployment/informations", params);
    return this.handleResult<Map<string,[]>>(this.http.get(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    }));
  }



}
