import {Component, Input, OnInit} from '@angular/core';
import {
  DeploymentTopologyDTO, NodeTemplate, NodeType,
  Topology,
  Workflow,
  WorkflowExecutionDTO,
  WorkflowExecutionStepStatus,
  WorkflowStep
} from "@app/core";
import {
  WfGraph,
  WfGraphEdge,
  WfStepGraphNode
} from "@app/shared/components/workflow-graph-viewer/workflow-graph.model";
import * as _ from 'lodash';
import {Observable, ReplaySubject} from "rxjs";
import {graphlib} from "dagre";
import Graph = graphlib.Graph;
import {GraphUtils} from "@app/shared/utils/graph-utils";

@Component({
  selector: 'w4c-workflow-graph-viewer',
  templateUrl: './workflow-graph-viewer.component.html',
  styleUrls: ['./workflow-graph-viewer.component.css']
})
export class WorkflowGraphViewerComponent implements OnInit {

  @Input()
  topology: Topology;

  @Input()
  deploymentTopology: DeploymentTopologyDTO;

  @Input()
  workflowExecutionChange: Observable<WorkflowExecutionDTO>;

  @Input()
  workflow: string;

  graph: WfGraph;

  panToNode = new ReplaySubject<string>();
  panToNode$: Observable<string> = this.panToNode.asObservable();

  // make lodash usable from template
  lodash = _;

  private lastExecutionId: string;

  constructor() { }

  ngOnInit() {
    if (this.workflow) {
      this.buildGraph(this.workflow);
    }
    if (this.workflowExecutionChange) {
      this.workflowExecutionChange.subscribe(workflowExecutionDto => {
        if (!this.workflow || workflowExecutionDto.execution.workflowId != this.workflow || workflowExecutionDto.execution.id != this.lastExecutionId) {
          this.workflow = workflowExecutionDto.execution.workflowId;
          this.lastExecutionId = workflowExecutionDto.execution.id;
          this.buildGraph(this.workflow);
        }
        for (const [stepId, stepStatusObj] of Object.entries(workflowExecutionDto.stepStatus)) {
          console.log(`step ${stepId} status ${stepStatusObj}`);
          // TODO: for each step, find the graph node and set the status
          _.find(this.graph.nodes, {id: stepId})['status'] = stepStatusObj;
          // if (stepStatusObj == WorkflowExecutionStepStatus.STARTED) {
          //   this.panToNode.next(stepId);
          // }
        }
      });
    }
  }

  private buildGraph(wfName: string) {
    let wfObj = this.topology.workflows[wfName];
    if (!wfObj) {
      return;
    }
    console.log(`Building grph for workflow ${wfName}`);

    let g = new Graph({ directed: true, compound: false, multigraph: true });
    let wf = <Workflow>wfObj;
    for (const [key, step] of Object.entries(wf.steps)) {
      console.log(`Adding node ${key}`);
      g.setNode(key, key);
      if (step.precedingSteps && step.precedingSteps.length > 0) {
        _.forEach(step.precedingSteps, preceding => {
          console.log(`Adding edge from ${preceding} to ${key}`);
          g.setEdge(preceding, key);
        })
      }
    }
    // now that we have a graph, let's remove state steps in it
    g = GraphUtils.filterGraph(g, n => {
      let step = <WorkflowStep>wf.steps[n];
      return step.activities && step.activities.length > 0 && step.activities[0]['stateName'];
    });
    // now build the displayable graph
    this.graph = new WfGraph();
    _.forEach(g.nodes(), n => {
      console.log(`adding step ${n} to displayable graph`);
      let step = <WorkflowStep>wf.steps[n];
      console.log(`step ${n} has target ${step.target}`);
      let node = new WfStepGraphNode(n, step.name,step.target);
      if (step.activities && step.activities.length > 0) {
        let activity = <any>step.activities[0];
        if (activity.operationName) {
          node.label = activity.operationName;
        } else if (activity.delegate) {
          node.label = activity.delegate;
        }
      }
      if (this.deploymentTopology) {
        let nodeTemplate = <NodeTemplate>this.deploymentTopology.topology.nodeTemplates[step.target];
        let nodeType = <NodeType>this.deploymentTopology.nodeTypes[nodeTemplate.type];
        node.nodeType = nodeType;
      }
      this.graph.nodes.push(node);
    });
    _.forEach(g.edges(), e => {
      this.graph.edges.push(new WfGraphEdge(e.v + "_" + e.w, e.v, e.w, []));
    });
    console.log("WF Graph ", JSON.stringify(this.graph));
  }
}
