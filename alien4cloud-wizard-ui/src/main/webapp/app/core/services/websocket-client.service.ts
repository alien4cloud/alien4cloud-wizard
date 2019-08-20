import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LocalStorageService} from "ngx-webstorage";
import * as SockJS from 'sockjs-client';
import {Observable} from "rxjs";
import {Client, Stomp, StompHeaders} from '@stomp/stompjs';
import {filter, first} from "rxjs/operators";
import { environment } from '../../../environments/environment';

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

  private static STOMP_CHANNEL_BASE_URL: string = environment.urlPrefix + "/rest/w4cAlienEndPoint";

  private client: any;
  private state: BehaviorSubject<SocketClientState>;

  constructor(private localStorage: LocalStorageService) {

    // get the JWT token from local storage
    const token = this.localStorage.retrieve('jwt_token');

    let ws = new SockJS(WebsocketClientService.STOMP_CHANNEL_BASE_URL + "?jwtToken=" + token);

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

  ngOnDestroy(): void {
    this.connect().pipe(first()).subscribe(client => client.deactivate());
  }

}
