import {CSARDependency} from "@app/core";

export interface IValue {
  definition: boolean;
}

export class PropertyDefinition implements IValue {
  type: string;
  entrySchema : PropertyDefinition;
  required: boolean;
  description: string;
  suggestionId: string;
  // constraints: PropertyConstraint[];
  default: PropertyValue<any>;
  definition: boolean;
  isPassword: boolean;
}

export abstract class AbstractPropertyValue implements IValue {
  definition: boolean;
}

export abstract class PropertyValue<T> extends AbstractPropertyValue {
  value: T;
}

export class MetaPropConfiguration extends PropertyDefinition {
  id: string;
  name: string;
  target: string;
  defaultValue: PropertyValue<any>;
  filtered: boolean;
}
