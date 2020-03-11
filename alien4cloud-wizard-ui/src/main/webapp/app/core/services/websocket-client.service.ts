import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, ReplaySubject} from "rxjs";
import {LocalStorageService} from "ngx-webstorage";
import * as SockJS from 'sockjs-client';
import {Observable} from "rxjs";
import {Client, Stomp, StompHeaders, StompSubscription} from '@stomp/stompjs';
import {filter, first, switchMap} from "rxjs/operators";
import { environment } from '../../../environments/environment';
import {PaaSDeploymentStatusMonitorEvent} from "@app/core";
import {DeploymentStatusChangeEvent} from "@app/core/models/internal-event.model";

export enum SocketClientState {
  ATTEMPTING, CONNECTED
}

/**
 * WIP: Not used at this stage.
 *
 * https://g00glen00b.be/websockets-angular/
 */
@Injectable({
  providedIn: 'root'
})
export class WebsocketClientService implements OnDestroy {

  private static STOMP_CHANNEL_BASE_URL: string = (environment.production) ? "rest/alienEndPoint" : environment.urlPrefix + "rest/w4cAlienEndPoint";

  private client: any;
  private state: BehaviorSubject<SocketClientState>;

  private deployementStatusChangeSubject = new ReplaySubject<DeploymentStatusChangeEvent>(1);
  public deployementStatusChange = this.deployementStatusChangeSubject.asObservable();

  constructor(private localStorage: LocalStorageService) {

    let url = WebsocketClientService.STOMP_CHANNEL_BASE_URL;
    if (!environment.production) {
      // get the JWT token from local storage
      const token = this.localStorage.retrieve('jwt_token');
      url += "?jwtToken=" + token;
    }
    let ws = new SockJS(url);

    this.client = Stomp.over(ws);
    this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    this.client.connect({}, () => {
      this.state.next(SocketClientState.CONNECTED);
    });
  }

  private connect(): Observable<Client> {
    return new Observable<Client>(observer => {
      this.state.pipe(filter(state => state === SocketClientState.CONNECTED)).subscribe(() => {
        observer.next(this.client);
      });
    });
  }

  registerEnvironmentStatusChannel(environmentId: string): Observable<PaaSDeploymentStatusMonitorEvent> {
    return this.connect().pipe(first(), switchMap(client => {
      return new Observable<any>(observer => {
        const subscription: StompSubscription = client.subscribe("/topic/environment-events/" + environmentId, message => {
          let event = JSON.parse(message['body']);
          let paaSDeploymentStatusMonitorEvent = <PaaSDeploymentStatusMonitorEvent>event;
          if (paaSDeploymentStatusMonitorEvent) {
            observer.next(paaSDeploymentStatusMonitorEvent);
            this.deployementStatusChangeSubject.next(new DeploymentStatusChangeEvent(environmentId, paaSDeploymentStatusMonitorEvent.deploymentStatus));
          } else {
            console.error("event is not a PaaSDeploymentStatusMonitorEvent : TODO manage !");
          }
        });
        return () => {
          console.log("Unsucribing WS channel for subscription ", subscription.id);
          client.unsubscribe(subscription.id);
        }
      });
    }));
  }

  ngOnDestroy(): void {
    console.log("Disconnecting WS client");
    this.connect().pipe(first()).subscribe(client => client.deactivate());
  }

}
