import { Component, OnInit } from '@angular/core';
import {FsmGraph} from "@app/features/application-wizard/core/fsm-graph.model";
import {Subject} from "rxjs";
import * as _ from "lodash";
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";

@Component({
  selector: 'w4c-fsm-graph-viewer',
  templateUrl: './fsm-graph-viewer.component.html',
  styleUrls: ['./fsm-graph-viewer.component.css']
})
export class FsmGraphViewerComponent implements OnInit {

  private fsmGraph: FsmGraph;
  private zoomToFit$: Subject<boolean> = new Subject();
  private center$: Subject<boolean> = new Subject();

  // make lodash usable from template
  private lodash = _;

  constructor(private fsm: AppplicationWizardMachineService) { }

  ngOnInit() {
    // get the graph so display it
    this.fsmGraph = this.fsm.getGraph();
    this.zoomToFit$.next(true);
    this.center$.next(true);

    // listen to FSM state change events
    this.fsm.applicationWizardState$.subscribe(data => {
      // flag all nodes as inactive
      this.fsmGraph.nodes.forEach(n => n.active = false);
      // find the node corresponding to the current state
      const graphNode = _.find(this.fsmGraph.nodes, node => node.id == data.value);
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

}
