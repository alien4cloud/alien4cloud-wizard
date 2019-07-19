import {Component, OnInit, Input} from '@angular/core';
import {TopologyGraph} from "@app/core";
import {Subject} from "rxjs";
import * as _ from "lodash";

@Component({
  selector: 'w4c-topology-graph-viewer',
  templateUrl: './topology-graph-viewer.component.html',
  styleUrls: ['./topology-graph-viewer.component.css']
})
export class TopologyGraphViewerComponent implements OnInit {

  // make lodash usable from template
  private lodash = _;

  zoomToFit$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();

  @Input() topologyGraph: TopologyGraph;

  constructor() {
  }

  ngOnInit() {
    this.zoomToFit$.next(true);
    this.center$.next(true);
  }

}
