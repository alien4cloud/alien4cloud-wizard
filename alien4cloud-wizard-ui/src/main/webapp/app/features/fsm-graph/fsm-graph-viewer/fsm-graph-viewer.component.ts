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

  fsmGraph: FsmGraph;
  zoomToFit$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
  // make lodash usable from template
  private lodash = _;

  constructor(private fsm: AppplicationWizardMachineService) { }

  ngOnInit() {
    this.fsmGraph = this.fsm.getGraph();
    this.zoomToFit$.next(true);
    this.center$.next(true);

    this.fsm.applicationWizardState$.subscribe(data => {
      this.fsmGraph.nodes.forEach(n => n.active = false);
      const graphNode = _.find(this.fsmGraph.nodes, node => node.id == data.value);
      console.log("color node: " + graphNode['data'].color);
      graphNode.active = true;
      graphNode.activated = true;
      this.fsmGraph.edges.forEach(e => e.data['active'] = false);
      const graphEdge = _.find(this.fsmGraph.edges, edge => (edge.source == data.history.value && edge.label == data.event.type));
      graphEdge.data['active'] = true;
    });
  }

}
