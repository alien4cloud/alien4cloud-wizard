export class Application {
    id: string;
    name: string;
    description :string;
    creationDate: number;
    lastUpdateDate: number;
    tags: any[];
    metaProperties: any[];
    userRoles:[]
}

export class TopologyOverview {
  description: string;
  namedMetaProperties: MetaProperty[];
  modules: ApplicationModule[];
  topologyId: string;
  topologyVersion: string;
}

export class ApplicationOverview extends TopologyOverview {
  // application: Application; // not used for the moment
  deploymentStatus: string;
  topologyGraph: TopologyGraph;
}

export class MetaPropertyConfiguration {
  id: string;
  name: string;
  description: string;
}

export class MetaProperty {
  configuration: MetaPropertyConfiguration;
  value :string;
}

export class Tag {
  name: string;
  value : string;
}

export class AbstractToscaType {
  archiveName: string;
  archiveVersion: string;
  elementId: string;
  description: string;
  tags: Tag[];
}

export class AbstractInheritableToscaType extends AbstractToscaType {

}

export class AbstractInstantiableToscaType extends AbstractInheritableToscaType {

}

export class NodeType extends AbstractInstantiableToscaType {

}

export class ApplicationModule {
  nodeType: NodeType;
  namedMetaProperties: MetaProperty[];
}

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
