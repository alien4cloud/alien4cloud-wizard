/**
 * A FsmGraph is a set of nodes and edges. It is just used to render the FSM as an oriented graph.
 */
export class FsmGraph {
  nodes: FsmGraphNode[] = [];
  edges: FsmGraphEdge[] = [];
}

export class FsmGraphNode {
  id: string;
  label: string;
  /** Indicates that this state has already been activated. */
  public activated: boolean;
  /** Indicates that this state is currently active. */
  public active: boolean;
  constructor(
    id: string,
    label: string
  ) {
    this.id = id;
    this.label = label;
  }
}

export class FsmGraphEdge {
  constructor(
    public id: string,
    public source: string,
    public target: string,
    public label: string,
    public data: any[]
  ) {}
}

