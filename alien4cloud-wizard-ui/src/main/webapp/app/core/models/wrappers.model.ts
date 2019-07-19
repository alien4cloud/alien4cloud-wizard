import {MetaProperty, NodeType, TopologyGraph} from "@app/core/models";

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

export class ApplicationModule {
  nodeType: NodeType;
  namedMetaProperties: MetaProperty[];
}
