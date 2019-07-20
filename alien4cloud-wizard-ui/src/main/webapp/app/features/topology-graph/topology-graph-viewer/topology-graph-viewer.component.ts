import {Component, OnInit, Input, AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy} from '@angular/core';
import {TopologyGraphService, TopologyGraph} from "@app/core";
import {Subject} from "rxjs";
import * as _ from "lodash";

@Component({
  selector: 'w4c-topology-graph-viewer',
  templateUrl: './topology-graph-viewer.component.html',
  styleUrls: ['./topology-graph-viewer.component.css']
})
export class TopologyGraphViewerComponent implements OnInit, AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy {

  // make lodash usable from template
  private lodash = _;

  zoomToFit$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();

  @Input() topologyGraph: TopologyGraph;

  constructor(private topologyGraphService: TopologyGraphService) {
    console.log("----- TopologyGraphViewerComponent instanciated");
  }

  ngOnInit() {
    console.log("TopologyGraphViewerComponent.ngOnInit");
    this.topologyGraphService.getCurrentTopologyGraph().subscribe((data: {}) => {
      this.topologyGraph = data['data'] as TopologyGraph;
    });
  }

  ngAfterViewChecked() {
    // console.log("TopologyGraphViewerComponent.ngAfterViewChecked");
  }

  ngAfterViewInit(): void {
    console.log("TopologyGraphViewerComponent.ngAfterViewInit");
    this.zoomToFit$.next(true);
    this.center$.next(true);
  }

  ngAfterContentInit(): void {
    console.log("TopologyGraphViewerComponent.ngAfterContentInit");
  }

  ngOnDestroy(): void {
    console.log("TopologyGraphViewerComponent.ngOnDestroy");
  }


}
