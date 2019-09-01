import {NodeType, WorkflowExecutionStepStatus} from "@app/core";

export class WfGraph {
  nodes: WfGraphNode[] = [];
  edges: WfGraphEdge[] = [];
}

export abstract class WfGraphNode {
  id: string;
  constructor(
    id: string
  ) {
    this.id = id;
  }
}

export class WfTipGraphNode extends WfGraphNode {
  isStart: boolean;
  constructor(
    id: string,
    isStart: boolean
  ) {
    super(id);
    this.isStart = isStart;
  }
}

export class WfStepGraphNode extends WfGraphNode {
  label: string;
  /** The WF step is an operation step. */
  operationStep: boolean;
  status: WorkflowExecutionStepStatus = WorkflowExecutionStepStatus.UNKNOWN;
  nodeType: NodeType;
  // stepNode = true;
  constructor(
    id: string,
    label: string
  ) {
    super(id);
    this.label = label;
  }
}

export class WfGraphEdge {
  constructor(
    public id: string,
    public source: string,
    public target: string,
    public data: any[]
  ) {}
}

export interface WfGraphNodeDimension {
  width: number;
  height: number;
}

