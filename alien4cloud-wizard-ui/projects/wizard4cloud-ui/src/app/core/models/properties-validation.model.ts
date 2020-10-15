import {PropertyDefinition} from "@alien4cloud/wizard4cloud-commons";
import {CSARDependency} from "@app/core/models/commons.model";

export class PropertyValidationRequest {
  value: any;
  definitionId: string;
  propertyDefinition: PropertyDefinition;
  dependencies: CSARDependency[];
}
