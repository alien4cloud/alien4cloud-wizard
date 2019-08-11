import {PropertyConstraint} from "./properties-constraint.model";

export interface IValue {
  definition: boolean;
}

export interface PropertyDefinition extends IValue {
  type: string;
  entrySchema : PropertyDefinition;
  required: boolean;
  description: string;
  suggestionId: string;
  constraints: PropertyConstraint[];
  default: PropertyValue<any>;
  definition: boolean;
  isPassword: boolean;
}

export interface AbstractPropertyValue extends IValue {
  definition: boolean;
}

export interface PropertyValue<T> extends AbstractPropertyValue {
  value: T;
}

export interface MetaPropConfiguration extends PropertyDefinition {
  id: string;
  name: string;
  target: string;
  defaultValue: PropertyValue<any>;
  filtered: boolean;
}
