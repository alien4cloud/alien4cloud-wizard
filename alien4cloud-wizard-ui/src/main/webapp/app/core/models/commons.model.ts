export class Tag {
  name: string;
  value : string;
}

export interface HasTags {
  tags: Tag[];
}

export class MetaPropertyConfiguration {
  id: string;
  name: string;
  description: string;
}

export class MetaProperty {
  configuration: MetaPropertyConfiguration;
  value: string;
}

export class CSARDependency {
  name: string;
  version: string;
  hash: string;
}

export class Version {
  majorVersion: number;
  minorVersion: number;
  incrementalVersion: number;
  buildNumber: number;
  qualifier : string ;
}
