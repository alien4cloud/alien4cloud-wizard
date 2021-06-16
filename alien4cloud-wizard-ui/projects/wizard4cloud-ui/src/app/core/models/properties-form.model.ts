import {AbstractPropertyValue, PropertyDefinition} from "@alien4cloud/wizard4cloud-commons";
import {HasProperties} from "@app/core/models/commons.model";
import {HasPropertyDefinitions} from "@app/core/models/tosca.model";

export class PropertyFormDefinition {
  /** The input name. */
  inputName: string;
  /** The property definition. */
  definition: PropertyDefinition;
  /** The raw value. */
  value: AbstractPropertyValue;
  editedValue: any;
}

export interface UpdatePropertyRequest {
  propertyName: string;
  propertyValue: any;
}

export class TemplatePropertiesEditorWrapper {
  properties: HasProperties;
  definitions: HasPropertyDefinitions;

}
