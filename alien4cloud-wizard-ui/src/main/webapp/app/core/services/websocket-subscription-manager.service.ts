import {Injectable} from '@angular/core';
import * as SockJS from 'sockjs-client';
import {Observable} from "rxjs";
import {Stomp, StompHeaders} from '@stomp/stompjs';
import {LocalStorageService} from "ngx-webstorage";
import {PaaSDeploymentStatusMonitorEvent} from "@app/core/models/monitor-event.model";

/**
 * Manage subscriptions to A4C websocket channels.
 *
 * FIXME: only one connection.
 */
@Injectable({
  providedIn: 'root'
})
export class WebsocketSubscriptionManager {

  private static stompChannelBaseUrl: string = "/api/rest/w4cAlienEndPoint";

  constructor(
    private localStorage: LocalStorageService) {
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

    // get the JWT token from local storage
    const token = this.localStorage.retrieve('jwt_token');

    let ws = new SockJS(WebsocketSubscriptionManager.stompChannelBaseUrl + "?jwtToken=" + token);
    return new Observable<any>(observer => {
      const conn = Stomp.over(ws);
      conn.connect({}, () => {
        conn.subscribe("/topic/environment-events/" + environmentId, message => {
          let event = JSON.parse(message['body']);
          let paaSDeploymentStatusMonitorEvent = <PaaSDeploymentStatusMonitorEvent>event;
          if (paaSDeploymentStatusMonitorEvent) {
            observer.next(paaSDeploymentStatusMonitorEvent);
          } else {
            console.error("event is not a PaaSDeploymentStatusMonitorEvent : TODO manage !");
          }
        });
      });
      return () => {
        console.log("Unsucribing WS channel");
        conn.disconnect(null);
      }
    });
  }

}
