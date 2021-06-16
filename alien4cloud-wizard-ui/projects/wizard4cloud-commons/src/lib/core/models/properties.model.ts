import {PropertyConstraint} from "./properties-constraint.model";

export interface IValue {
  definition: boolean;
}

export class PropertyDefinition implements IValue {
  type: string;
  entrySchema : PropertyDefinition;
  required: boolean;
  description: string;
  suggestionId: string;
  suggestionPolicy: string;
  constraints: PropertyConstraint[];
  default: PropertyValue<any>;
  definition: boolean;
  password: boolean;
  /**
   * Does'nt exist in backend. Added to manage settings.
   */
  options: any;
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
  filtered: boolean;
}

export interface PropertyRequest {
  value: string;
  definitionId: string;
}

export class ScalarPropertyValue implements PropertyValue<string> {
  constructor(value: string) { this.value = value; }
  value: string;
  definition: boolean = false;
}
