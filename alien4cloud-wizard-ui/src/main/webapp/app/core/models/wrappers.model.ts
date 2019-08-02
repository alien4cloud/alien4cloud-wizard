import {Application, ApplicationEnvironment, MetaProperty, NodeType, TopologyGraph} from "@app/core/models";

export class TopologyOverview {
  description: string;
  namedMetaProperties: MetaProperty[];
  modules: ApplicationModule[];
  topologyId: string;
  topologyVersion: string;
}

export class ApplicationOverview extends TopologyOverview {
  application: Application;
  deploymentStatus: string;
  applicationEnvironment: ApplicationEnvironment;
}

export class ApplicationModule {
  nodeType: NodeType;
  namedMetaProperties: MetaProperty[];
}
