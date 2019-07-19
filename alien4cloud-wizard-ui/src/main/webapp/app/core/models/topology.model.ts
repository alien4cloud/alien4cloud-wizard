
export class TopologyGraph {
  nodes: TopologyGraphNode[];
  edges: TopologyGraphEdge[];
}
export class TopologyGraphNode {
  id: string;
  label: string;
}
export class TopologyGraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}
