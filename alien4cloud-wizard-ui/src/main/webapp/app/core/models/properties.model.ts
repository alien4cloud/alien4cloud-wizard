export interface IValue {
  definition: boolean;
}

export interface PropertyConstraint {

}

export class PropertyDefinition implements IValue {
  type: string;
  entrySchema : PropertyDefinition;
  required: boolean;
  description: string;
  suggestionId: string;
  constraints: PropertyConstraint[] ;
  defaultValue: PropertyValue<any>;
  definition: boolean;
  isPassword: boolean;
}

export abstract class AbstractPropertyValue implements IValue {
  definition: boolean;
}

export abstract class PropertyValue<T> extends AbstractPropertyValue {
  value: T;
}
