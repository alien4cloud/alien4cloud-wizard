import {Component, OnInit, Input, AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy} from '@angular/core';
import {TopologyOverview, NodeTemplate, RelationshipTemplate, ApplicationModule} from "@app/core";
import {Subject} from "rxjs";
import * as _ from "lodash";
import {graphlib} from "dagre";
import Graph = graphlib.Graph;
import {
  TopologyGraph,
  TopologyGraphEdge,
  TopologyGraphNode
} from "@app/shared/components/topology-graph-viewer/topology-graph.model";
import {ToscaTypeShortNamePipe} from "@app/shared/pipes";
import {GraphUtils} from "@app/shared/utils/graph-utils";

@Component({
  selector: 'w4c-topology-graph-viewer',
  templateUrl: './topology-graph-viewer.component.html',
  styleUrls: ['./topology-graph-viewer.component.css']
})
export class TopologyGraphViewerComponent implements OnInit, AfterViewInit {

  // make lodash usable from template
  lodash = _;

  zoomToFit$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();

  @Input()
  overview: TopologyOverview;

  /**
   * All the filtered node names.
   */
  filteredNodeNames: Set<string>;

  topologyGraph: TopologyGraph;

  constructor(
    private toscaTypeShortNamePipe: ToscaTypeShortNamePipe
  ) { }

  ngOnInit() {
    if (this.overview) {
      // fill the all module names set
      this.filteredNodeNames = new Set();
      for (const [eKey, eObj] of Object.entries(this.overview.componentsPerCategory)) {
        let modules = <ApplicationModule[]>eObj;
        modules.forEach(am => this.filteredNodeNames.add(am.nodeName));
      }
      this.buildGraph(true);
    }
  }

  private buildGraph(filtered: boolean) {
    // first of all build a graph using dagre
    let g = new Graph({ directed: true, compound: false, multigraph: true });
    // each node of the topology is a graph node
    for (const [nKey, nodeObj] of Object.entries(this.overview.topologyDTO.topology.nodeTemplates)) {
      console.log(`Adding node ${nKey}`);
      g.setNode(nKey, nKey);
      let node = <NodeTemplate>nodeObj;
      if (node.relationships) {
        for (const [rkey, rObj] of Object.entries(node.relationships)) {
          console.log(`Relationship ${rkey}: `, JSON.stringify(rObj));
          let relationship = <RelationshipTemplate>rObj.value;
          let name = this.toscaTypeShortNamePipe.transform(relationship.type);
          console.log(`Adding edge from ${nKey} to ${relationship.target} with name ${name}`);
          // each relationship is an edge
          g.setEdge(nKey, relationship.target, "", name);
        }
      }
    }
    if (filtered) {
      g = GraphUtils.filterGraph(g, n => !this.filteredNodeNames.has(n));
    }
    this.renderGraph(g);
  }

  /**
   * Render a displayble graph from the dagre graph.
   */
  private renderGraph(g: Graph) {
    let topologyGraph = new TopologyGraph();
    _.forEach(g.nodes(), n => {
      let nodeTemplate = <NodeTemplate>this.overview.topologyDTO.topology.nodeTemplates[n];
      let topologyGraphNode = new TopologyGraphNode();
      topologyGraphNode.id = n;
      topologyGraphNode.label = n;
      topologyGraphNode.nodeType = this.overview.topologyDTO.nodeTypes[nodeTemplate.type];
      topologyGraph.nodes.push(topologyGraphNode);
    });
    _.forEach(g.edges(), e => {
      // let edge = g.edge(e);
      console.log("Edge is: ", JSON.stringify(e));
      let topologyGraphEdge = new TopologyGraphEdge();
      topologyGraphEdge.id = e.v + "_" + e.w + e.name;
      topologyGraphEdge.label = e.name;
      topologyGraphEdge.source = e.v;
      topologyGraphEdge.target = e.w;
      topologyGraph.edges.push(topologyGraphEdge);
    });
    this.topologyGraph = topologyGraph;
  }

  ngAfterViewInit(): void {
    console.log("TopologyGraphViewerComponent.ngAfterViewInit");
    this.zoomToFit$.next(true);
    this.center$.next(true);
  }

}
