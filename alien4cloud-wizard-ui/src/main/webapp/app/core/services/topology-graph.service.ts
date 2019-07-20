import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

/**
 * This service retrieves a graph for a given topology.
 * Since it is used to exchange data between components, you must call setTopology() before getTopologyGraph().
 */
@Injectable({
  providedIn: 'root'
})
export class TopologyGraphService {

  constructor(private http: HttpClient) {
  }

  private topologyId: string;
  private topologyVersion: string;

  setTopology(topologyId: string, topologyVersion: string) {
    this.topologyId = topologyId;
    this.topologyVersion = topologyVersion;
  }

  private getTopologyGraph(topologyId: string, topologyVersion: string): Observable<{}> {
    return this.http.get(`/api/rest/latest/wizard/applications/graph/${topologyId}:${topologyVersion}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    }).pipe(data => data);
  }

  public getCurrentTopologyGraph(): Observable<{}> {
    return this.getTopologyGraph(this.topologyId, this.topologyVersion);
  }

}
