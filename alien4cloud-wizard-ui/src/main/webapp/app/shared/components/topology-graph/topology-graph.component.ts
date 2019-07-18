import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Layout, Edge, Node } from '@swimlane/ngx-graph';

import { TopologyGraph } from "@app/core";

@Component({
  selector: 'w4c-topology-graph',
  templateUrl: './topology-graph.component.html',
  styleUrls: ['./topology-graph.component.scss']
})
export class TopologyGraphComponent implements OnInit {

  @Input() topologyGraph: TopologyGraph;

  constructor(
    private route: ActivatedRoute
  ) { }

  zoomToFit$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();

  ngOnInit() {
    console.log("TopologyGraphComponent.ngOnInit");
    this.zoomToFit$.next(true);
    this.center$.next(true);
    // let topologyId = this.route.snapshot.params['topologyId'];
    // let topologyVersion = this.route.snapshot.params['topologyVersion'];
    // // let topologyId = this.route.paramMap.pipe(
    // //   switchMap((params: ParamMap) => params.get('topologyId'))
    // // );
    // console.log("topologyId: " + topologyId);
    // console.log("topologyVersion: " + topologyVersion);
  }

}
