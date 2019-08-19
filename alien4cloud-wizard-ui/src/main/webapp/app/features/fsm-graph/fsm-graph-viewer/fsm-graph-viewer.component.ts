import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FsmGraph} from "@app/features/application-wizard/core/fsm-graph.model";
import {Subject} from "rxjs";
import * as _ from "lodash";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {SettingsService} from "@app/core";

@Component({
  selector: 'w4c-fsm-graph-viewer',
  templateUrl: './fsm-graph-viewer.component.html',
  styleUrls: ['./fsm-graph-viewer.component.css']
})
export class FsmGraphViewerComponent implements OnInit {

  fsmGraph: FsmGraph;
  fsmGraphHeight: number;
  fsmGraphWitdh: number;

  panToNode$: Subject<string> = new Subject();

  // make lodash usable from template
  lodash = _;

  private zoomLevel: number;

  @ViewChild('mainDiv', {static: true}) mainDiv: ElementRef;

  constructor(
    private fsm: AppplicationWizardMachineService,
    private settingsService: SettingsService
  ) {
    this.zoomLevel = 1;
    // use the preferred user setting for zoom level
    this.zoomLevel = this.settingsService.getSetting(SettingsService.FSM_GRAPH_ZOOM_LEVEL);
  }

  ngOnInit() {
    this.fsmGraphHeight = this.settingsService.getSetting(SettingsService.FSM_GRAPH_HEIGHT_SETTING);
    // this.fsmGraphWitdh = this.mainDiv.nativeElement.offsetWidth;
    this.fsmGraphWitdh = this.settingsService.getSetting(SettingsService.FSM_GRAPH_WIDTH_SETTING);

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
      const graphEdge = _.find(this.fsmGraph.edges, edge => (edge.source == data.history.value && edge.label == data.event.type && edge.target == data.value));
      // flag it as active
      if (graphEdge) {
        graphEdge.data['active'] = true;
      } else {
        // FIXME : why sometimes the edge is not found
        console.error("Edge not found FIXME")
      }
    });
  }

  /**
   * React to the zoom change event and store the zoom level in local storage.
   * TODO: it would be better to observe via rxjs and add a debounce time
   * @param event
   */
  zoomChangedHandler(zoomLevel) {
    // the zoom has changed, let's store it (event is zoom level)
    this.settingsService.setSetting(SettingsService.FSM_GRAPH_ZOOM_LEVEL, zoomLevel);
  }

}
