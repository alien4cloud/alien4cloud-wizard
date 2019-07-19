export class Tag {
  name: string;
  value : string;
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
