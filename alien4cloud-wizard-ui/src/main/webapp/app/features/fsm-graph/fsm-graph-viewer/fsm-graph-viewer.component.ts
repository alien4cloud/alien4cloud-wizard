import { Component, OnInit } from '@angular/core';
import {FsmGraph, FsmGraphNode} from "@app/features/application-wizard/core/fsm-graph.model";
import {Subject} from "rxjs";
import * as _ from "lodash";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {LocalStorageService} from "ngx-webstorage";

@Component({
  selector: 'w4c-fsm-graph-viewer',
  templateUrl: './fsm-graph-viewer.component.html',
  styleUrls: ['./fsm-graph-viewer.component.css']
})
export class FsmGraphViewerComponent implements OnInit {

  private fsmGraph: FsmGraph;
  private panToNode$: Subject<string> = new Subject();

  // make lodash usable from template
  private lodash = _;

  private static STORAGE_ZOOM_LEVEL: string = "fsm-zoom-level";
  private zoomLevel: number;

  constructor(
    private fsm: AppplicationWizardMachineService,
    private localStorage: LocalStorageService
  ) {
    this.zoomLevel = 1;
    // if found, use the prefered user setting for zoom level
    let storedZoomLevel = this.localStorage.retrieve(FsmGraphViewerComponent.STORAGE_ZOOM_LEVEL);
    if (storedZoomLevel) {
      this.zoomLevel = storedZoomLevel;
    }
  }

  ngOnInit() {
    // get the graph so display it
    this.fsmGraph = this.fsm.getGraph();

    // listen to FSM state change events
    this.fsm.applicationWizardState$.subscribe(data => {
      // flag all nodes as inactive
      this.fsmGraph.nodes.forEach(n => n.active = false);
      // find the node corresponding to the current state
      const graphNode = _.find(this.fsmGraph.nodes, node => node.id == data.value);
      // move the node at the center of the screen
      this.panToNode$.next(graphNode.id);
      // flag it as active && activated
      graphNode.active = true;
      graphNode.activated = true;
      // flag all edges as inactive
      this.fsmGraph.edges.forEach(e => e.data['active'] = false);
      // the edge concerned by the current state transition
      const graphEdge = _.find(this.fsmGraph.edges, edge => (edge.source == data.history.value && edge.label == data.event.type));
      // flag it as active
      graphEdge.data['active'] = true;
    });


  }

  /**
   * React to the zoom change event and store the zoom level in local storage.
   * TODO: it would be better to observe via rxjs and add a debounce time
   * @param event
   */
  zoomChangedHandler(zoomLevel) {
    // the zoom has changed, let's store it (event is zoom level)
    this.localStorage.store(FsmGraphViewerComponent.STORAGE_ZOOM_LEVEL, zoomLevel);
  }

}
