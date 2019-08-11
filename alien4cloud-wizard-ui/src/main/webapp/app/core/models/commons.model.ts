export interface Tag {
  name: string;
  value : string;
}

export interface HasTags {
  tags: Tag[];
}

export interface MetaPropertyConfiguration {
  id: string;
  name: string;
  description: string;
}

export interface MetaProperty {
  configuration: MetaPropertyConfiguration;
  value: string;
}

export interface CSARDependency {
  name: string;
  version: string;
  hash: string;
}

export interface Version {
  majorVersion: number;
  minorVersion: number;
  incrementalVersion: number;
  buildNumber: number;
  qualifier : string ;
}
