import {Application, ApplicationEnvironment, MetaProperty, NodeType, TopologyGraph} from "@app/core/models";

export interface TopologyOverview {
  description: string;
  namedMetaProperties: MetaProperty[];
  modules: ApplicationModule[];
  topologyId: string;
  topologyVersion: string;
}

export interface ApplicationOverview extends TopologyOverview {
  application: Application;
  deploymentStatus: string;
  applicationEnvironment: ApplicationEnvironment;
}

export interface ApplicationModule {
  nodeType: NodeType;
  namedMetaProperties: MetaProperty[];
}
