import {Inject, Injectable} from '@angular/core';
import * as SockJS from 'sockjs-client';
import {Observable, ReplaySubject} from "rxjs";
import {Stomp} from '@stomp/stompjs';
import {LocalStorageService} from "ngx-webstorage";
import {AbstractPaaSWorkflowMonitorEvent, PaaSDeploymentStatusMonitorEvent} from "@app/core/models/monitor-event.model";
import {DeploymentStatusChangeEvent} from "@app/core/models/internal-event.model";
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "@alien4cloud/wizard4cloud-commons";

/**
 * Manage subscriptions to A4C websocket channels.
 *
 * FIXME: only one connection.
 */
@Injectable({
  providedIn: 'root'
})
export class WebsocketSubscriptionManager {

  private deployementStatusChangeSubject = new ReplaySubject<DeploymentStatusChangeEvent>(1);
  public deployementStatusChange = this.deployementStatusChangeSubject.asObservable();

  private stompChannelBaseUrl: string;

  constructor(
    private localStorage: LocalStorageService,
    @Inject(BOOTSTRAP_SETTINGS) private bootstrapSettings: BootstrapSettings
  ) {
    this.stompChannelBaseUrl = (bootstrapSettings.production) ? "../rest/alienEndPoint" : bootstrapSettings.urlPrefix + "../rest/w4cAlienEndPoint";
  }

  /**
   * A hot subscription to environment-events channel to receive events about a given environment changes.
   *
   * FIXME: https://www.portaildulibre.fr/a4c-jira/browse/ALIEN-3152
   * FIXME: Too many connections on WS make A4C down.
   *
   * @param environmentId
   */
  registerEnvironmentStatusChannel(environmentId: string): Observable<PaaSDeploymentStatusMonitorEvent> {

    let url = this.stompChannelBaseUrl;
    if (!this.bootstrapSettings.production) {
      // get the JWT token from local storage
      const token = this.localStorage.retrieve('jwt_token');
      url += "?jwtToken=" + token;
    }
    let ws = new SockJS(url);

    return new Observable<any>(observer => {
      const conn = Stomp.over(ws);
      conn.connect({}, () => {
        conn.subscribe("/topic/environment-events/" + environmentId, message => {
          let event = JSON.parse(message['body']);
          let paaSDeploymentStatusMonitorEvent = <PaaSDeploymentStatusMonitorEvent>event;
          if (paaSDeploymentStatusMonitorEvent) {
            observer.next(paaSDeploymentStatusMonitorEvent);
            this.deployementStatusChangeSubject.next(new DeploymentStatusChangeEvent(environmentId, paaSDeploymentStatusMonitorEvent.deploymentStatus));
          } else {
            console.error("event is not a PaaSDeploymentStatusMonitorEvent : TODO manage !");
          }
        });
      });
      return () => {
        console.log("Unsucribing WS channel (EnvironmentStatusChannel)");
        conn.disconnect(null);
      }
    });
  }

  registerWorkflowEventChannel(deploymentId: string): Observable<AbstractPaaSWorkflowMonitorEvent> {

    let url = this.stompChannelBaseUrl;
    if (!this.bootstrapSettings.production) {
      // get the JWT token from local storage
      const token = this.localStorage.retrieve('jwt_token');
      url += "?jwtToken=" + token;
    }
    let ws = new SockJS(url);

    return new Observable<any>(observer => {
      const conn = Stomp.over(ws);
      conn.connect({}, () => {
        conn.subscribe("/topic/deployment-events/" + deploymentId + "/paasworkflowmonitorevent", message => {
          let event = JSON.parse(message['body']);
          let abstractPaaSWorkflowMonitorEvent = <AbstractPaaSWorkflowMonitorEvent>event;
          if (abstractPaaSWorkflowMonitorEvent) {
            observer.next(abstractPaaSWorkflowMonitorEvent);
            //this.deployementStatusChangeSubject.next(new DeploymentStatusChangeEvent(environmentId, paaSDeploymentStatusMonitorEvent.deploymentStatus));
          } else {
            console.error("event is not a AbstractPaaSWorkflowMonitorEvent : TODO manage !");
          }
        });
      });
      return () => {
        console.log("Unsucribing WS channel (WorkflowEventChannel)");
        conn.disconnect(null);
      }
    });
  }

}
