import {CSARDependency, HasTags, Tag, Version} from '@app/core/models';

export class Topology implements HasTags {
  archiveName: string;
  archiveVersion: string;
  nestedVersion: Version;
  workspace: string;
  description: string;
  creationDate: number;
  lastUpdateDate: number;
  dependencies: CSARDependency[];
  unprocessedWorkflows: {};
  empty: boolean;
  id: string;
  tags: Tag[];
}

