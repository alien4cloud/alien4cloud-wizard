import {
  Application,
  ApplicationEnvironment,
  MetaProperty,
  NodeType,
  TopologyDTO
} from "@app/core/models";

export interface TopologyOverview {
  description: string;
  namedMetaProperties: MetaProperty[];
  componentCategories: string[];
  componentsPerCategory: Map<string, ApplicationModule[]>;
  topologyDTO: TopologyDTO;
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
