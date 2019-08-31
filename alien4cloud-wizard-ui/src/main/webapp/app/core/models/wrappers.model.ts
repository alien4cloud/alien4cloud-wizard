import {Application, ApplicationEnvironment, MetaProperty, NodeType, TopologyGraph} from "@app/core/models";

export interface TopologyOverview {
  description: string;
  namedMetaProperties: MetaProperty[];
  componentCategories: string[];
  componentsPerCategory: Map<string, ApplicationModule[]>;
  topologyId: string;
  topologyVersion: string;
}

export interface ApplicationOverview extends TopologyOverview {
  application: Application;
  deploymentStatus: string;
  applicationEnvironment: ApplicationEnvironment;
}

export interface ApplicationModule {
  nodeName: string;
  nodeType: NodeType;
  namedMetaProperties: MetaProperty[];
}
