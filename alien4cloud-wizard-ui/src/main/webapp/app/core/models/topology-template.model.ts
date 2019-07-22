import {HasTags, Tag, TopologyNestedVersion} from '@app/core/models';

export class TopologyTemplate implements HasTags {
  archiveName: string;
  archiveVersion: string;
  nestedVersion: TopologyNestedVersion;
  workspace: string;
  description: string;
  creationDate: number;
  lastUpdateDate: number;
  dependencies: [];
  unprocessedWorkflows: {};
  empty: boolean;
  id: string;
  tags: Tag[];
}

